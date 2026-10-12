
import { crearServicio } from './crud.service.js';
import institutoModel from '../models/institutos.model.js';

const servicioBase = crearServicio(institutoModel.tabla);

export default {
    listar: servicioBase.listar,
    obtener: servicioBase.obtener,

    crear: async (datos) => {
        const datosValidados = institutoModel.validar(datos);
        return servicioBase.crear(datosValidados);
    },

    actualizar: async (id, datos) => {
        const datosValidados = institutoModel.validar(datos, true);
        return servicioBase.actualizar(id, datosValidados);
    },

    eliminar: servicioBase.eliminar,
};
