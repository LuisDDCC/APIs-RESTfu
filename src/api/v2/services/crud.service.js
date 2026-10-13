// Servicio genérico CRUD sobre Supabase.
// crearServicio(tabla, columnas) es una fábrica: recibe el nombre de una tabla y devuelve un objeto
// con las operaciones listar, obtener, crear, actualizar y eliminar para esa tabla.
// Los demás servicios de esta carpeta se construyen a partir de esta fábrica.
import supabase from '../config/database.config.js';

// Columnas que administra la BD y que el cliente no debe poder escribir
const PROTEGIDAS = ['id', 'created_at', 'updated_at'];

export const errorHttp = (status, message) => Object.assign(new Error(message), { status });

const esObjeto = (valor) => valor !== null && typeof valor === 'object' && !Array.isArray(valor);

export const limpiarBody = (body) => {
    if (!esObjeto(body)) throw errorHttp(400, 'El cuerpo de la petición debe ser un objeto JSON');
    const limpio = Object.fromEntries(
        Object.entries(body).filter(([k, v]) => !PROTEGIDAS.includes(k) && v !== undefined)
    );
    if (Object.keys(limpio).length === 0) throw errorHttp(400, 'No se enviaron campos válidos');
    return limpio;
};

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
        // Acepta un objeto o un arreglo de objetos (inserción múltiple)
        if (Array.isArray(body)) {
            if (body.length === 0) throw errorHttp(400, 'El arreglo está vacío');
            const { data, error } = await supabase.from(tabla).insert(body.map(limpiarBody)).select(columnas);
            if (error) throw error;
            return data;
        }
        const { data, error } = await supabase.from(tabla).insert(limpiarBody(body)).select(columnas).single();
        if (error) throw error;
        return data;
    },
    actualizar: async (id, body) => {
        const { data, error } = await supabase.from(tabla).update(limpiarBody(body)).eq('id', id).select(columnas).single();
        if (error) throw error;
        return data;
    },
    eliminar: async (id) => {
        const { data, error } = await supabase.from(tabla).delete().eq('id', id).select('id');
        if (error) throw error;
        if (data.length === 0) throw errorHttp(404, 'No encontrado');
    },
});
