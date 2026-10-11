import bcrypt from 'bcryptjs';
import supabase from '../config/database.config.js';
import { crearServicio } from './crud.service.js';

const COLUMNAS = 'id, nombre, email, creado, created_at, updated_at';
const base = crearServicio('usuarios', COLUMNAS);

export default {
    ...base,
    crear: async ({ nombre, email, password }) => {
        const password_hash = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('usuarios')
            .insert({ nombre, email, password_hash })
            .select(COLUMNAS)
            .single();
        if (error) throw error;
        return data;
    },
    actualizar: (id, { nombre, email }) => base.actualizar(id, { nombre, email }),
};