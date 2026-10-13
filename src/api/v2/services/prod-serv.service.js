// Servicio de Productos y Servicios (tabla cat_prod_serv de Supabase).
// Administra el catálogo de productos/servicios con sus estatus y archivos.
// Hereda las 5 operaciones del servicio genérico (listar, obtener, crear, actualizar, eliminar).
import { crearServicio } from './crud.service.js';

export default crearServicio('cat_prod_serv');
