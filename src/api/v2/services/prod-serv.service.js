import { crearServicio } from './crud.service.js';
import prodServModel from '../models/prod-serv.model.js';

export default crearServicio(
    prodServModel.tabla,
    '*',
    prodServModel
);