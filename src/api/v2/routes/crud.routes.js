import { Router } from 'express';

export const crearRouter = (c) => {
    const router = Router();
    router.get('/', c.listar);
    router.get('/:id', c.obtener);
    router.post('/', c.crear);
    router.put('/:id', c.actualizar);
    router.delete('/:id', c.eliminar);
    return router;
};