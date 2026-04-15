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
                    edad INTEGER,
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
    console.log('Tablas SQLite listas...........................InitDatabase');



    // migracion simle para agregar columnas nuevas sin perder datos
    const ensureColum = async (
        taable: "usuarios" | "notas",
        column: string,
        definition: string
    ) => {
        // Implement column ensuring logic here
        const columns = await db.getAllAsync<{ name: string }>
            (`PRAGMA table_info(${taable});`);
        const columnExists = columns.some((col) => col.name === column);
        if (!columnExists) {
            await db.execAsync(`ALTER TABLE ${taable} ADD COLUMN ${column} ${definition};`);
            console.log(`Columna '${column}' agregada a la tabla '${taable}'`);
        } else {
            console.log(`Columna '${column}' ya existe en la tabla '${taable}'`);
        }
    };
    //--------agregar columnas nuevas sin perder datos (migracion simple)----------------//

    // await ensureColum('usuarios', 'telefono', 'TEXT');
    // await ensureColum('usuarios', 'edad', 'INTEGER');


};

export const clearAllData = async () => {
    await db.withExclusiveTransactionAsync(async () => {
        await db.execAsync('DELETE FROM notas;');
        await db.execAsync('DELETE FROM usuarios;');
        await db.execAsync("DELETE FROM sqlite_sequence WHERE name IN ('notas', 'usuarios');");
    });
};