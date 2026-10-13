// Servicio de Usuarios (tabla usuarios de Supabase).
// Parte del servicio genérico de crud.service.js, pero reemplaza crear y actualizar por seguridad:
// la contraseña se guarda solo como hash (bcrypt) y nunca se devuelve en las consultas.
import bcrypt from 'bcryptjs';
import supabase from '../config/database.config.js';
import { crearServicio, errorHttp } from './crud.service.js';

// Columnas que se devuelven al cliente; password_hash queda fuera a propósito
const COLUMNAS = 'id, nombre, email, creado, created_at, updated_at';
const base = crearServicio('usuarios', COLUMNAS);

// Verifica que el valor sea un texto con contenido (no vacío ni solo espacios)
const esTextoValido = (valor) => typeof valor === 'string' && valor.trim() !== '';

export default {
    /* 
       Hereda del servicio genérico (usando solo COLUMNAS):
      listar(): Devuelve todos los usuarios, sin su password_hash.
      obtener(id): Devuelve un usuario por su id, sin su password_hash. Si no existe, lanza 404.
      eliminar(id): Borra el usuario. Si no existía, lanza 404.
    */
    ...base,

    /*
       crear(body): Registra un usuario nuevo.
       Requiere nombre, email y password (si falta alguno lanza 400).
       Convierte el password en hash con bcrypt y guarda solo el hash; devuelve el usuario creado sin el hash.
       Si el email ya existe, Supabase responde error de duplicado (409 en el controller).
    */
    crear: async (body) => {
        const { nombre, email, password } = body ?? {};
        if (!esTextoValido(nombre) || !esTextoValido(email) || !esTextoValido(password)) {
            throw errorHttp(400, 'Se requieren nombre, email y password');
        }
        const password_hash = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('usuarios')
            .insert({ nombre, email, password_hash })
            .select(COLUMNAS)
            .single();
        if (error) throw error;
        return data;
    },

    // actualizar(id, body): Modifica los datos de un usuario.
    // Solo permite cambiar nombre y email; cualquier otro campo (password, id, etc.) se ignora.
    // limpiarBody descarta los campos no enviados y lanza 400 si no viene ninguno; si el id no existe, lanza 404.
    actualizar: (id, body) => base.actualizar(id, { nombre: body?.nombre, email: body?.email }),
};
