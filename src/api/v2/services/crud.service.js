
import supabase from '../config/database.config.js';

export const crearServicio = (
    tabla,
    columnas = '*',
    modelo = null
) => {
    const validar = (datos, parcial = false) => {
        if (!modelo?.validar) return datos;
        return modelo.validar(datos, parcial);
    };

    return {
        listar: async () => {
            const { data, error } = await supabase
                .from(tabla)
                .select(columnas);

            if (error) throw error;
            return data;
        },

        obtener: async (id) => {
            const { data, error } = await supabase
                .from(tabla)
                .select(columnas)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        crear: async (body) => {
            const datosValidados = validar(body);

            const { data, error } = await supabase
                .from(tabla)
                .insert(datosValidados)
                .select(columnas)
                .single();

            if (error) throw error;
            return data;
        },

        actualizar: async (id, body) => {
            const datosValidados = validar(body, true);

            const { data, error } = await supabase
                .from(tabla)
                .update(datosValidados)
                .eq('id', id)
                .select(columnas)
                .single();

            if (error) throw error;
            return data;
        },

        eliminar: async (id) => {
            const { error } = await supabase
                .from(tabla)
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    };
};
