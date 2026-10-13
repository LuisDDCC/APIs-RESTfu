/*
   Servicio de Cadena de Posiciones (tabla cadena_posiciones de Supabase).
   No define lógica propia: llama a la fábrica crearServicio con el nombre de la tabla y exporta
   el objeto resultante con las 5 operaciones del servicio genérico:
    listar():  SELECT de todos los registros
    obtener(id): SELECT de un solo registro por id
    crear(body): INSERT (acepta un objeto o un arreglo de objetos)
    actualizar(id, body): UPDATE del registro con ese id
    eliminar(id):  DELETE del registro con ese id (404 si no existe)
   Como no se pasa el segundo argumento (columnas), se devuelven todas las columnas ('*').
   En crear/actualizar el body se limpia con limpiarBody: se descartan id, created_at y updated_at.
*/
import { crearServicio } from './crud.service.js';

export default crearServicio('cadena_posiciones');
