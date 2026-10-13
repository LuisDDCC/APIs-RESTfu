// Servicio de Institutos (tabla cat_institutos de Supabase).
// Administra el catálogo de institutos: claves OK/BK, descripción, alias, matriz y giro.
// No define lógica propia: hereda las 5 operaciones del servicio genérico de crud.service.js.
//
// Métodos disponibles:
//   listar()               -> Devuelve todos los institutos del catálogo.
//   obtener(id)            -> Devuelve un instituto por su id (uuid). Si no existe, lanza 404.
//   crear(body)            -> Inserta un instituto (objeto) o varios (arreglo) y devuelve lo insertado.
//                             Ignora id, created_at y updated_at aunque vengan en el body.
//   actualizar(id, body)   -> Modifica solo los campos enviados del instituto y devuelve el registro actualizado.
//                             Si el id no existe, lanza 404; si el body no trae campos válidos, lanza 400.
//   eliminar(id)           -> Borra el instituto. Si no existía, lanza 404.
import { crearServicio } from './crud.service.js';

export default crearServicio('cat_institutos');
