// Servicio de Posiciones (tabla posiciones de Supabase).
// Guarda la consulta de un activo subyacente (ticker, precio actual) junto con su lista de
// contratos de opciones (CALL/PUT, strike, prima, volumen, IV, fecha de vencimiento).
// Hereda las 5 operaciones del servicio genérico (listar, obtener, crear, actualizar, eliminar).
import { crearServicio } from './crud.service.js';

export default crearServicio('posiciones');
