import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { initDatabase } from "../../db/initDatabase";
import { createUsuario, getAllUsuarios } from "../../db/CRUD-Usuarios";
import { createNota, getAllNotas } from "../../db/CRUD-Notas";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../App";

type UsuarioItem = {
    id: number;
    nombre: string;
    email: string;
};

export default function Notes() {
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
    const [totalNotas, setTotalNotas] = useState(0);
    const [savingUser, setSavingUser] = useState(false);
    const [savingNota, setSavingNota] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [edad, setEdad] = useState("");

    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState<number | null>(null);

    const isSaving = savingUser || savingNota;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const usuarioSeleccionado = useMemo(
        () => usuarios.find((u) => u.id === usuarioSeleccionadoId) ?? null,
        [usuarios, usuarioSeleccionadoId]
    );

    const loadData = useCallback(async () => {
        await initDatabase();
        const users = (await getAllUsuarios()) as any[];
        const notas = (await getAllNotas()) as any[];

        const normalizedUsers: UsuarioItem[] = users.map((u) => ({
            id: Number(u.id),
            nombre: String(u.nombre ?? "Sin nombre"),
            email: String(u.email ?? "Sin email"),
        }));

        setUsuarios(normalizedUsers);
        setTotalNotas(notas.length);

        if (!usuarioSeleccionadoId && normalizedUsers.length > 0) {
            setUsuarioSeleccionadoId(normalizedUsers[0].id);
        }
    }, [usuarioSeleccionadoId]);

    useEffect(() => {
        const bootstrap = async () => {
            try {
                await loadData();
            } catch (error) {
                Alert.alert(
                    "Error",
                    `No se pudo cargar la información: ${error instanceof Error ? error.message : String(error)}`
                );
            }
        };

        bootstrap();
    }, [loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await loadData();
        } catch (error) {
            Alert.alert(
                "Error",
                `No se pudo actualizar la información: ${error instanceof Error ? error.message : String(error)}`
            );
        } finally {
            setRefreshing(false);
        }
    };

    const guardarUsuario = async () => {
        const nombreValue = nombre.trim();
        const emailValue = email.trim();
        const edadValue = Number(edad);

        if (!nombreValue || !emailValue || !edad) {
            Alert.alert("Campos requeridos", "Completa nombre, email y edad.");
            return;
        }

        if (Number.isNaN(edadValue) || edadValue < 1) {
            Alert.alert("Edad inválida", "Ingresa una edad numérica válida.");
            return;
        }

        if (edad.length > 2) {
            Alert.alert("Edad inválida", "La edad debe tener máximo 2 dígitos.");
            return;
        }

        if (!emailRegex.test(emailValue)) {
            Alert.alert("Email inválido", "Ingresa un correo con formato válido (ej: usuario@dominio.com).");
            return;
        }

        setSavingUser(true);
        try {
            const result = await createUsuario({
                nombre: nombreValue,
                email: emailValue,
                edad: edadValue,
            });

            const newId = Number(result?.lastInsertRowId ?? 0);
            setNombre("");
            setEmail("");
            setEdad("");

            await loadData();

            if (newId > 0) {
                setUsuarioSeleccionadoId(newId);
            }

            Alert.alert(
                "Usuario guardado",
                `Nombre: ${nombreValue}\nEmail: ${emailValue}\nEdad: ${edadValue}`
            );
        } catch (error) {
            Alert.alert(
                "Error",
                `No se pudo guardar el usuario: ${error instanceof Error ? error.message : String(error)}`
            );
        } finally {
            setSavingUser(false);
        }
    };

    const guardarNota = async () => {
        const tituloValue = titulo.trim();
        const contenidoValue = contenido.trim();

        if (!tituloValue) {
            Alert.alert("Campo requerido", "El título de la nota es obligatorio.");
            return;
        }

        if (!usuarioSeleccionadoId) {
            Alert.alert("Usuario requerido", "Selecciona un usuario para asignar la nota.");
            return;
        }

        setSavingNota(true);
        try {
            await createNota({
                titulo: tituloValue,
                contenido: contenidoValue,
                usuario_id: usuarioSeleccionadoId,
            });

            setTitulo("");
            setContenido("");
            await loadData();
            Alert.alert("Nota guardada", "La nota se registró correctamente.");
        } catch (error) {
            Alert.alert(
                "Error",
                `No se pudo guardar la nota: ${error instanceof Error ? error.message : String(error)}`
            );
        } finally {
            setSavingNota(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.title}>crear usuarios y notas</Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Form de Usuario</Text>
                <TextInput
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Nombre"
                    style={styles.input}
                    editable={!isSaving}
                />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    editable={!isSaving}
                />
                <TextInput
                    value={edad}
                    onChangeText={(value) => setEdad(value.replace(/\D/g, "").slice(0, 2))}
                    placeholder="Edad"
                    keyboardType="numeric"
                    maxLength={2}
                    style={styles.input}
                    editable={!isSaving}
                />
                <TouchableOpacity
                    style={[styles.button, isSaving && styles.buttonDisabled]}
                    onPress={guardarUsuario}
                    disabled={isSaving}
                >
                    <Text style={styles.buttonText}>{savingUser ? "Guardando..." : "Guardar Usuario"}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Form de Nota</Text>
                <TextInput
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Título de la nota"
                    style={styles.input}
                    editable={!isSaving}
                />
                <TextInput
                    value={contenido}
                    onChangeText={setContenido}
                    placeholder="Contenido"
                    style={[styles.input, styles.inputMultiline]}
                    multiline
                    editable={!isSaving}
                />

                <Text style={styles.label}>Selecciona usuario:</Text>
                <View style={styles.selectContainer}>
                    {usuarios.length === 0 ? (
                        <Text style={styles.emptyText}>No hay usuarios registrados.</Text>
                    ) : (
                        usuarios.map((u) => (
                            <TouchableOpacity
                                key={u.id}
                                style={[
                                    styles.userOption,
                                    usuarioSeleccionadoId === u.id && styles.userOptionSelected,
                                ]}
                                onPress={() => setUsuarioSeleccionadoId(u.id)}
                                disabled={isSaving}
                            >
                                <Text style={styles.userOptionText}>{u.nombre} - {u.email}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <Text style={styles.selectedText}>
                    Usuario seleccionado: {usuarioSeleccionado ? `${usuarioSeleccionado.nombre} (ID ${usuarioSeleccionado.id})` : "Ninguno"}
                </Text>

                <TouchableOpacity
                    style={[styles.button, isSaving && styles.buttonDisabled]}
                    onPress={guardarNota}
                    disabled={isSaving || usuarios.length === 0}
                >
                    <Text style={styles.buttonText}>{savingNota ? "Guardando..." : "Guardar Nota"}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.summaryCard}
                onPress={() => navigation.navigate("Database")}
                activeOpacity={0.85}
            >
                <Text style={styles.summaryText}>Usuarios: {usuarios.length}</Text>
                <Text style={styles.summaryText}>Notas: {totalNotas}</Text>
                <Text style={styles.summaryHint}>Click para ver detalle</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
        backgroundColor: "#f5f7fb",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1f2a44",
        marginTop: 8,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: "#e1e7f0",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1f2a44",
    },
    input: {
        borderWidth: 1,
        borderColor: "#cad4e0",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#ffffff",
    },
    inputMultiline: {
        minHeight: 90,
        textAlignVertical: "top",
    },
    label: {
        fontWeight: "600",
        color: "#243450",
        marginTop: 4,
    },
    selectContainer: {
        gap: 8,
    },
    userOption: {
        borderWidth: 1,
        borderColor: "#cad4e0",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#ffffff",
    },
    userOptionSelected: {
        borderColor: "#2563eb",
        backgroundColor: "#e8f0ff",
    },
    userOptionText: {
        color: "#1f2a44",
    },
    selectedText: {
        color: "#334155",
        fontStyle: "italic",
    },
    emptyText: {
        color: "#64748b",
        fontStyle: "italic",
    },
    button: {
        backgroundColor: "#2563eb",
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 2,
    },
    buttonDisabled: {
        backgroundColor: "#93c5fd",
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "700",
    },
    summaryCard: {
        backgroundColor: "#1f2a44",
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
    },
    summaryText: {
        color: "#ffffff",
        fontWeight: "600",
    },
    summaryHint: {
        color: "#c7d2fe",
        marginTop: 6,
        fontSize: 12,
    },
});
