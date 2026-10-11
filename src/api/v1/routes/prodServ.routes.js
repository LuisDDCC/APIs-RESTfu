import { Router } from 'express';
import * as prodServController from '../controllers/prodserv.controller.js';

const router = Router();

// GET
router.get('/', prodServController.getProdServList);
router.get('/:id', prodServController.getProdServItem);

// POST
router.post('/', prodServController.postProdServItem);
router.post('/many-pwa', prodServController.addManyProdServ);
router.post('/:id/estatus', prodServController.pushObjEstatusProdServ);

// PUT
router.put('/:id', prodServController.updateProdServ);
router.put('/:id/estatus', prodServController.updateProdServEstatus);

// DELETE
router.delete('/:id', prodServController.deleteProdServItem);

export default router;