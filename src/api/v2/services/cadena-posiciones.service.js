
import { crearServicio } from './crud.service.js';
import cadenaPosicionesModel from '../models/cadena-posiciones.model.js';

const servicioBase = crearServicio(cadenaPosicionesModel.tabla);

export default {
    listar: servicioBase.listar,
    obtener: servicioBase.obtener,

    crear: async (datos) => {
        const datosValidados = cadenaPosicionesModel.validar(datos);
        return servicioBase.crear(datosValidados);
    },

    actualizar: async (id, datos) => {
        const datosValidados = cadenaPosicionesModel.validar(datos);
        return servicioBase.actualizar(id, datosValidados);
    },

    eliminar: servicioBase.eliminar,
};
