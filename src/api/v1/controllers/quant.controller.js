// src/controllers/quant.controller.js
import * as QuantService from '../services/quant.service.js';

export const valuarOpcion = async (req, res) => {
  try {
    const { S, K, r, T, sigma, tipo, precioMercado } = req.body;

    // Validación básica de entrada
    if (!S || !K || r === undefined || !T || !sigma || !tipo) {
      return res.status(400).json({
        message:
          'Faltan parámetros. Se requieren: S (precio subyacente), K (strike), r (tasa libre de riesgo), T (tiempo a vencimiento en años), sigma (volatilidad), tipo (call/put).',
      });
    }

    if (tipo !== 'call' && tipo !== 'put') {
      return res.status(400).json({ message: "El campo 'tipo' debe ser 'call' o 'put'." });
    }

    const resultado = QuantService.valuarContrato({ S, K, r, T, sigma, tipo, precioMercado });
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error: ' + error });
  }
};
