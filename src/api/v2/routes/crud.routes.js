import { Router } from 'express';

// Crea un router CRUD genérico a partir de un controlador
export const crearRouter = (controlador) => {
    const router = Router();
     //GET 
    router.get('/', controlador.listar);
    router.get('/:id', controlador.obtener);
    //POST
    router.post('/', controlador.crear);
    //PUT
    router.put('/:id', controlador.actualizar);
    //DELETE
    router.delete('/:id', controlador.eliminar);
 
    return router;
};