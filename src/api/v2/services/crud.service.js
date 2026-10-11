import supabase from '../config/database.config.js';

export const crearServicio = (tabla, columnas = '*') => ({
    listar: async () => {
        const { data, error } = await supabase.from(tabla).select(columnas);
        if (error) throw error;
        return data;
    },
    obtener: async (id) => {
        const { data, error } = await supabase.from(tabla).select(columnas).eq('id', id).single();
        if (error) throw error;
        return data;
    },
    crear: async (body) => {
        const { data, error } = await supabase.from(tabla).insert(body).select(columnas).single();
        if (error) throw error;
        return data;
    },
    actualizar: async (id, body) => {
        const { data, error } = await supabase.from(tabla).update(body).eq('id', id).select(columnas).single();
        if (error) throw error;
        return data;
    },
    eliminar: async (id) => {
        const { error } = await supabase.from(tabla).delete().eq('id', id);
        if (error) throw error;
    },
});