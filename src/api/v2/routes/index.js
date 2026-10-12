import { Router } from 'express';
import config from '../config/config.js';
import { crearControlador } from '../controllers/crud.controller.js';
import { crearRouter } from './crud.routes.js';

// Servicios de cada recurso
import institutosService from '../services/institutos.service.js';
import prodServService from '../services/prod-serv.service.js';
import posicionesService from '../services/posiciones.service.js';
import cadenaPosicionesService from '../services/cadena-posiciones.service.js';
import usuariosService from '../services/usuarios.service.js';

// Genera un router CRUD completo a partir de un servicio:
// servicio -> controlador -> router
const crud = (servicio) => 
      crearRouter(crearControlador(servicio));

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    // Monta el router principal en la URL base de la API
    app.use(api, router);
    
    // Registro de cada recurso con sus 5 endpoints (GET, GET/:id, POST, PUT/:id, DELETE/:id)
    router.use('/institutos', crud(institutosService));
    router.use('/productos-servicios', crud(prodServService));
    router.use('/posiciones', crud(posicionesService));
    router.use('/cadena-posiciones', crud(cadenaPosicionesService));
    router.use('/usuarios', crud(usuariosService));

    return router;
};

export default routerAPI;