// src/routes/wheel.routes.js
import { Router } from 'express';
import * as wheelController from '../controllers/wheel.controller.js';

const router = Router();

// POST /api/v1/wheel/ejecutar
router.post('/ejecutar', wheelController.ejecutarWheel);

export default router;