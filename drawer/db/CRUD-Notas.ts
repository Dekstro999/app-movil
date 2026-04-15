import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mydatabase.db');

interface Nota {
    id?: number;
    titulo: string;
    contenido: string;
    usuario_id: number;
    created_at?: string;
}

// create
export const createNota = async (nota: Nota): Promise<any> => {
    const statement = await db.prepareAsync(
        'INSERT INTO notas (titulo, contenido, usuario_id, created_at) VALUES ($titulo, $contenido, $usuario_id, $created_at)'
    );

    return await statement.executeAsync({
        $titulo: nota.titulo,
        $contenido: nota.contenido,
        $usuario_id: nota.usuario_id,
        $created_at: nota.created_at || new Date().toISOString(),
    });
};

// get by id
export const getNotaById = async (id: number) => {
    return await db.getFirstAsync<Nota>(
        'SELECT * FROM notas WHERE id = ?',
        [id]
    );
};

// get all notes by usuario_id
export const getNotasByUsuarioId = async (usuario_id: number) => {
    return await db.getAllAsync<Nota>(
        'SELECT * FROM notas WHERE usuario_id = ? ORDER BY created_at DESC',
        [usuario_id]
    );
};

// get all notes
export const getAllNotas = async () => {
    return await db.getAllAsync<Nota>(
        'SELECT * FROM notas ORDER BY created_at DESC'
    );
};

// update nota
export const updateNota = async (id: number, nota: Partial<Nota>) => {
    const fields = Object.keys(nota)
        .filter(key => key !== 'id' && key !== 'created_at')
        .map(key => `${key} = ?`)
        .join(', ');
    
    if (!fields) {
        throw new Error('No fields to update');
    }

    const values = Object.entries(nota)
        .filter(([key]) => key !== 'id' && key !== 'created_at')
        .map(([, value]) => value);
    
    values.push(id);

    const statement = await db.prepareAsync(`UPDATE notas SET ${fields} WHERE id = ?`);
    return await statement.executeAsync(values);
};

// delete nota
export const deleteNota = async (id: number) => {
    const statement = await db.prepareAsync('DELETE FROM notas WHERE id = ?');
    return await statement.executeAsync([id]);
};

// delete all notes by usuario_id
export const deleteNotasByUsuarioId = async (usuario_id: number) => {
    const statement = await db.prepareAsync('DELETE FROM notas WHERE usuario_id = ?');
    return await statement.executeAsync([usuario_id]);
};

// borrar todas las notas (para testing)
export const deleteAllNotas = async () => {
    const statement = await db.prepareAsync('DELETE FROM notas');
    return await statement.executeAsync();
};
