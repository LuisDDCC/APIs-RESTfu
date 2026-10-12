
import { crearServicio } from './crud.service.js';
import posicionesModel from '../models/posiciones.model.js';

const servicioBase = crearServicio(posicionesModel.tabla);

export default {
    listar: servicioBase.listar,
    obtener: servicioBase.obtener,

    crear: async (datos) => {
        const datosValidados = posicionesModel.validar(datos);
        return servicioBase.crear(datosValidados);
    },

    actualizar: async (id, datos) => {
        const datosValidados = posicionesModel.validar(datos);
        return servicioBase.actualizar(id, datosValidados);
    },

    eliminar: servicioBase.eliminar,
};
