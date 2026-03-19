
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { initDatabase } from "../../db/initDatabase";
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
        setLogs((prevLogs) => [...prevLogs, message]);
    };

    const demo = async () => {
        setRunning(true);
        setLogs([]);
        try {
            appendLog('Iniciando demo de operaciones CRUD en SQLite...');
            await initDatabase();
            appendLog('Base de datos inicializada correctamente.');
            const userEmail = `demo_${Date.now()}@example.com`;
            const userInsert = await createUsuario({
                nombre: 'Usuario Demo',
                email: userEmail,
                edad: 30,
                created_at: new Date().toISOString(),
            });
            appendLog(`Usuario creado con ID: ${userInsert.insertId}`);

            const allUsuarios = await getAllUsuarios();
            appendLog(`Total de usuarios en la base de datos: ${allUsuarios.length}`);

            const notaInsert = await createNota({
                titulo: 'Nota de Demo',
                contenido: 'Esta es una nota de demostración.',
                usuario_id: userInsert.insertId,
                created_at: new Date().toISOString(),
            });
            appendLog(`Nota creada con ID: ${notaInsert.insertId}`);

            const allNotas = await getAllNotas();
            appendLog(`Total de notas en la base de datos: ${allNotas.length}`);

        } catch (error) {
            appendLog(`Error en demo: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (



        <View style={styles.container}>
            <Text>Demo Screen</Text>
            <TouchableOpacity
                onPress={demo}
                style={buttonStyle}
            >
                <Text style={{ color: '#8b2121' }}>{'Ejecutar Demo CRUD'}</Text>
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
