
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { clearAllData, initDatabase } from "../../db/initDatabase";
import { createUsuario, getAllUsuarios } from "../../db/CRUD-Usuarios";
import { createNota, getAllNotas } from "../../db/CRUD-Notas";
import { useState } from "react";


export default function Demo() {
    const [logs, setLogs] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const buttonStyle = [
        styles.button,
        running && styles.buttonDisabled,
    ];

    const appendLog = (message: string) => {
        Alert.alert(message);
        // setLogs((prevLogs) => [...prevLogs, message]);
    };

    const getInsertId = (result: any) => Number(result?.lastInsertRowId ?? 0);

    const demo = async () => {
        setRunning(true);
        setLogs([]);
        try {
            appendLog('Iniciando demo de operaciones CRUD en SQLite...');
            await initDatabase();
            appendLog('Base de datos inicializada.......Demo');
            const userEmail = `demo_${Date.now()}@example.com`;
            // edad aleatoria entre 18 y 60
            const userEdad = Math.floor(Math.random() * (60 - 18 + 1)) + 18;
            const newUsuario = {
                nombre: 'Usuario Demo',
                email: userEmail,
                edad: userEdad,
            };

            const userInsert = await createUsuario(
                newUsuario
            );
            const userId = getInsertId(userInsert);
            appendLog(`Usuario creado con ID: ${userId}`);
            
            // appendLog(`Usuario insertado: ${JSON.stringify(newUsuario)}`);
            Alert.alert(`Usuario insertado: ${JSON.stringify(newUsuario)}`);

            const allUsuarios = await getAllUsuarios();
            Alert.alert(`Total de usuarios en la base de datos: ${allUsuarios.length}`);

            const notaInsert = await createNota({
                titulo: 'Nota de Demo',
                contenido: 'Esta es una nota de demostración.',
                usuario_id: userId,
                created_at: new Date().toISOString(),
            });
            const notaId = getInsertId(notaInsert);
            appendLog(`Nota creada con ID: ${notaId}`);

            const allNotas = await getAllNotas();
            appendLog(`Total de notas en la base de datos: ${allNotas.length}`);

        } catch (error) {
            // appendLog(`Error en demo: ${error instanceof Error ? error.message : String(error)}`);
            Alert.alert(`Error en demo: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setRunning(false);
        }
    };

    return (



        <View style={styles.container}>
            <Text>Demo Screen</Text>
            <TouchableOpacity
                onPress={demo}
                style={buttonStyle}
                disabled={running}
            >
                <Text style={{ color: '#8b2121' }}>{running ? 'Ejecutando...' : 'Ejecutar Demo CRUD'}</Text>
            </TouchableOpacity>

            {/* boton borrado usuarios */}
            <TouchableOpacity
                onPress={async () => {
                    setRunning(true);
                    try {
                        await clearAllData();
                        const usuariosRestantes = await getAllUsuarios();
                        const notasRestantes = await getAllNotas();
                        appendLog(`Borrado completo. Usuarios: ${usuariosRestantes.length}, Notas: ${notasRestantes.length}`);
                    } catch (error) {
                        Alert.alert(`Error al borrar datos: ${error instanceof Error ? error.message : String(error)}`);
                    } finally {
                        setRunning(false);
                    }
                }}
                style={buttonStyle}
                disabled={running}
            >
                <Text style={{ color: '#8b2121' }}>Borrar Todos los Usuarios y Notas</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    buttonDisabled: {
        backgroundColor: "#95d3ff",
    },
});
