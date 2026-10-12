import bcrypt from 'bcryptjs';
import supabase from '../config/database.config.js';
import { crearServicio } from './crud.service.js';

const TABLA = 'usuarios';
// Columnas que se regresan al cliente (nunca se regresa password_hash)
const COLUMNAS = 'id, nombre, email, creado, created_at, updated_at';
const SALT_ROUNDS = 10;
const PASSWORD_MIN = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const base = crearServicio(TABLA, COLUMNAS);

// Error de validación: el controlador lo responde como 400 (no como 500)
const errorValidacion = (mensaje) => {
    const error = new Error(mensaje);
    error.name = 'ValidationError';
    return error;
};

const limpiarTexto = (valor) => (typeof valor === 'string' ? valor.trim() : valor);
const normalizarEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : email);

const validarEmail = (email) => {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
        throw errorValidacion('El email no tiene un formato válido');
    }
};

const validarPassword = (password) => {
    if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
        throw errorValidacion(`El password debe tener al menos ${PASSWORD_MIN} caracteres`);
    }
};

export default {
    ...base,

    // POST /usuarios -> nombre, email y password son obligatorios
    crear: async ({ nombre, email, password } = {}) => {
        nombre = limpiarTexto(nombre);
        email = normalizarEmail(email);

        if (!nombre || !email || !password) {
            throw errorValidacion('nombre, email y password son obligatorios');
        }
        validarEmail(email);
        validarPassword(password);

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const { data, error } = await supabase
            .from(TABLA)
            .insert({ nombre, email, password_hash })
            .select(COLUMNAS)
            .single();
        if (error) throw error;
        return data;
    },

    // PUT /usuarios/:id -> solo actualiza los campos que vengan (nombre, email y/o password)
    actualizar: async (id, { nombre, email, password } = {}) => {
        const cambios = {};

        if (nombre !== undefined) {
            cambios.nombre = limpiarTexto(nombre);
            if (!cambios.nombre) throw errorValidacion('El nombre no puede ir vacío');
        }
        if (email !== undefined) {
            cambios.email = normalizarEmail(email);
            validarEmail(cambios.email);
        }
        if (password !== undefined) {
            validarPassword(password);
            cambios.password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        }

        if (Object.keys(cambios).length === 0) {
            throw errorValidacion('Envía al menos uno de estos campos: nombre, email o password');
        }

        cambios.updated_at = new Date().toISOString();
        return base.actualizar(id, cambios);
    },
};