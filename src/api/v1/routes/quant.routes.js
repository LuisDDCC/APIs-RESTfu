// src/routes/quant.routes.js
import { Router } from 'express';
import * as quantController from '../controllers/quant.controller.js';

const router = Router();

// POST /api/v1/quant/valuar
router.post('/valuar', quantController.valuarOpcion);

export default router;
