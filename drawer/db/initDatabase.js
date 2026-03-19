import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mydatabase.db');

export const initDatabase = async () => {
        await db.withExclusiveTransactionAsync(async () => {
            await db.execAsync('PRAGMA foreign_keys = ON;');

            // Crear tabla de usuarios e imprimir mensaje de éxito o error
            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
        `)
            .then(() => {
                console.log('Tabla de usuarios creada o ya existe');
            })
            .catch((error) => {
                console.error('Error al crear la tabla de usuarios', error);
            })
        ; 

            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS notas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                contenido TEXT,
                usuario_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            );
        `);

        });
        console.log('Tablas SQLite listas');

};