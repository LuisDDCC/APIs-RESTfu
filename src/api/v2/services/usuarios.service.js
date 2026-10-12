
import bcrypt from 'bcryptjs';
import supabase from '../config/database.config.js';
import { crearServicio } from './crud.service.js';
import usuarioModel from '../models/usuarios.model.js';

const COLUMNAS = 'id, nombre, email, creado, created_at, updated_at';

const base = crearServicio(
    usuarioModel.tabla,
    COLUMNAS,
    usuarioModel
);

export default {
    listar: base.listar,

    obtener: base.obtener,

    crear: async (datos) => {
        const datosValidados = usuarioModel.validar(datos);
        const { nombre, email, password } = datosValidados;

        const password_hash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from(usuarioModel.tabla)
            .insert({ nombre, email, password_hash })
            .select(COLUMNAS)
            .single();

        if (error) throw error;
        return data;
    },

    actualizar: async (id, datos) => {
        const datosValidados = usuarioModel.validar(datos, true);

        const cambios = {};

        if (datosValidados.nombre !== undefined) {
            cambios.nombre = datosValidados.nombre;
        }

        if (datosValidados.email !== undefined) {
            cambios.email = datosValidados.email;
        }

        if (datosValidados.password !== undefined) {
            cambios.password_hash = await bcrypt.hash(
                datosValidados.password,
                10
            );
        }

        if (Object.keys(cambios).length === 0) {
            throw new Error('Debes proporcionar al menos un campo para actualizar');
        }

        return base.actualizar(id, cambios);
    },

    eliminar: base.eliminar,
};
