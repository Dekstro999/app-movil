import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('mydatabase.db');

interface Usuario {
    id: number;
    nombre: string;
    email: string;
    edad: number;
    created_at: string;
}

// create
export const createUsuario = async (usuario: Usuario): Promise<any> => {

    const statement = await db.prepareAsync('INSERT INTO usuarios (nombre, email, edad, created_at) VALUES ($nombre, $email, $edad, $created_at)');

    return await statement.executeAsync({
        $nombre: usuario.nombre,
        $email: usuario.email,
        $edad: usuario.edad,
        $created_at: usuario.created_at
    });
};

// get by id
export const getUsuarioById = async (id: number) => {
    return await db.getFirstAsync<{data: Usuario}> (
        'SELECT * FROM usuarios WHERE id = ?',
        [id]
    );    
    
};

// update usuario
export const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
    const fields = Object.keys(usuario).map(key => `${key} = ?`).join(', ');
    const values = Object.values(usuario);
    values.push(id); // Agregar el ID al final para la cláusula WHERE

    const statement = await db.prepareAsync(`UPDATE usuarios SET ${fields} WHERE id = ?`);
    return await statement.executeAsync(values);
}

// delete usuario
export const deleteUsuario = async (id: number) => {
    const statement = await db.prepareAsync('DELETE FROM usuarios WHERE id = ?');
    return await statement.executeAsync([id]);
}