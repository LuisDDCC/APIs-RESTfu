// src/services/wheel.service.js

/**
 * MÓDULO F5 - THE WHEEL (La Rueda)
 * Estrategia cíclica: Cash-Secured Put → Asignación → Covered Call
 */

// ─── FASE 1: Cash-Secured Put ────────────────────────────────────────────────
// El inversionista vende una PUT OTM y reserva efectivo para comprar el activo
// si la opción es ejercida. Mientras tanto cobra la prima.
export const evaluarCashSecuredPut = ({ S, K, prima, cantidadContratos = 1 }) => {
  const efectivoRequerido = K * 100 * cantidadContratos;   // capital bloqueado
  const ingresosPrima     = prima * 100 * cantidadContratos;
  const precioNeto        = K - prima;                      // costo neto si se asigna
  const rendimiento       = (ingresosPrima / efectivoRequerido) * 100;

  const fase = S >= K ? "OTM - No asignado (cobra prima)" : "ITM - Posible asignación";

  return {
    fase: "Fase 1 - Cash-Secured Put",
    estado: fase,
    efectivoRequerido:  Number(efectivoRequerido.toFixed(2)),
    ingresosPrima:      Number(ingresosPrima.toFixed(2)),
    precioNetoAsignacion: Number(precioNeto.toFixed(2)),
    rendimientoPorcentaje: Number(rendimiento.toFixed(4)),
  };
};

// ─── FASE 2: Asignación ──────────────────────────────────────────────────────
// Si la PUT fue ejercida, el inversionista compra las acciones al precio strike.
// Se registra el costo base ajustado por las primas cobradas.
export const registrarAsignacion = ({ K, primasCobradas, cantidadContratos = 1 }) => {
  const accionesAdquiridas = 100 * cantidadContratos;
  const costoBase          = K - primasCobradas;            // precio de equilibrio real
  const costoTotal         = costoBase * accionesAdquiridas;

  return {
    fase: "Fase 2 - Asignación",
    accionesAdquiridas,
    precioStrikeAsignacion: K,
    primasCobradas:         Number(primasCobradas.toFixed(2)),
    costoBaseAjustado:      Number(costoBase.toFixed(2)),
    costoTotalPosicion:     Number(costoTotal.toFixed(2)),
  };
};

// ─── FASE 3: Covered Call ─────────────────────────────────────────────────────
// El inversionista vende una CALL OTM sobre las acciones que ya posee.
// Genera ingreso adicional y puede salir de la posición si se ejerce.
export const evaluarCoveredCall = ({
  S,
  K,
  prima,
  costoBase,
  cantidadContratos = 1,
}) => {
  const accionesEnPosicion = 100 * cantidadContratos;
  const ingresosPrima      = prima * 100 * cantidadContratos;
  const gananciaSiEjercida = (K - costoBase) * accionesEnPosicion + ingresosPrima;
  const rendimiento        = (ingresosPrima / (costoBase * accionesEnPosicion)) * 100;

  const estado = S >= K
    ? "ITM - Posible ejercicio (venta de acciones)"
    : "OTM - No ejercida (cobra prima, mantiene acciones)";

  return {
    fase: "Fase 3 - Covered Call",
    estado,
    precioMercado:        S,
    strikeCall:           K,
    ingresosPrima:        Number(ingresosPrima.toFixed(2)),
    gananciaTotalSiEjercida: Number(gananciaSiEjercida.toFixed(2)),
    rendimientoPorcentaje:   Number(rendimiento.toFixed(4)),
  };
};

// ─── CICLO COMPLETO: The Wheel ───────────────────────────────────────────────
export const ejecutarWheel = ({
  S,
  K_put,
  prima_put,
  K_call,
  prima_call,
  primasCobradas,
  cantidadContratos = 1,
}) => {
  const fase1 = evaluarCashSecuredPut({
    S, K: K_put, prima: prima_put, cantidadContratos,
  });

  const fase2 = registrarAsignacion({
    K: K_put, primasCobradas, cantidadContratos,
  });

  const fase3 = evaluarCoveredCall({
    S, K: K_call, prima: prima_call,
    costoBase: fase2.costoBaseAjustado,
    cantidadContratos,
  });

  const totalPrimasCobradas =
    fase1.ingresosPrima + fase3.ingresosPrima;

  const pnlTotal =
    (S - fase2.costoBaseAjustado) * 100 * cantidadContratos + totalPrimasCobradas;

  return {
    estrategia: "The Wheel (La Rueda)",
    resumen: {
      precioMercadoActual: S,
      totalPrimasCobradas: Number(totalPrimasCobradas.toFixed(2)),
      pnlEstimado:         Number(pnlTotal.toFixed(2)),
      cicloCompleto:       S >= K_call,
    },
    fase1,
    fase2,
    fase3,
  };
};