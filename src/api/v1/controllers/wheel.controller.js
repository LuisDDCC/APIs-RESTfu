// src/controllers/wheel.controller.js
import * as WheelService from '../services/wheel.service.js';

export const ejecutarWheel = async (req, res) => {
  try {
    const {
      S, K_put, prima_put,
      K_call, prima_call,
      primasCobradas,
      cantidadContratos,
    } = req.body;

    if (!S || !K_put || !prima_put || !K_call || !prima_call || !primasCobradas) {
      return res.status(400).json({
        message:
          'Faltan parámetros. Se requieren: S, K_put, prima_put, K_call, prima_call, primasCobradas.',
      });
    }

    const resultado = WheelService.ejecutarWheel({
      S, K_put, prima_put,
      K_call, prima_call,
      primasCobradas,
      cantidadContratos: cantidadContratos || 1,
    });

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error: ' + error });
  }
};