// src/services/quant.service.js
// MÓDULO F0 - Motor Cuantitativo Central

function normPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function normCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
}

function calcD1D2(S, K, r, T, sigma) {
  const d1 =
    (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return { d1, d2 };
}

export const blackScholes = (S, K, r, T, sigma, tipo = "call") => {
  const { d1, d2 } = calcD1D2(S, K, r, T, sigma);
  if (tipo === "call") {
    return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  }
  return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
};

export const calcularGriegas = (S, K, r, T, sigma, tipo = "call") => {
  const { d1, d2 } = calcD1D2(S, K, r, T, sigma);
  const delta = tipo === "call" ? normCDF(d1) : normCDF(d1) - 1;
  const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
  const vega = (S * normPDF(d1) * Math.sqrt(T)) / 100;

  let theta;
  if (tipo === "call") {
    theta =
      (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) -
        r * K * Math.exp(-r * T) * normCDF(d2)) /
      365;
  } else {
    theta =
      (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) +
        r * K * Math.exp(-r * T) * normCDF(-d2)) /
      365;
  }

  let rho;
  if (tipo === "call") {
    rho = (K * T * Math.exp(-r * T) * normCDF(d2)) / 100;
  } else {
    rho = (-K * T * Math.exp(-r * T) * normCDF(-d2)) / 100;
  }

  return { delta, gamma, theta, vega, rho };
};

export const volatilidadImplicita = (
  precioMercado,
  S,
  K,
  r,
  T,
  tipo = "call",
  sigmaInicial = 0.3,
  tolerancia = 1e-6,
  maxIteraciones = 100
) => {
  let sigma = sigmaInicial;
  for (let i = 0; i < maxIteraciones; i++) {
    const precioBSM = blackScholes(S, K, r, T, sigma, tipo);
    const { vega } = calcularGriegas(S, K, r, T, sigma, tipo);
    const vegaReal = vega * 100;
    const diferencia = precioBSM - precioMercado;

    if (Math.abs(diferencia) < tolerancia) {
      return { sigma, iteraciones: i + 1, convergio: true };
    }
    if (vegaReal === 0) {
      return { sigma, iteraciones: i + 1, convergio: false, error: "Vega es cero" };
    }
    sigma = sigma - diferencia / vegaReal;
    if (sigma <= 0) sigma = 0.001;
  }
  return { sigma, iteraciones: maxIteraciones, convergio: false };
};

export const binomialCRR = (S, K, r, T, sigma, pasos = 100, tipo = "call", americana = true) => {
  const dt = T / pasos;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);
  const descuento = Math.exp(-r * dt);

  let precios = [];
  for (let i = 0; i <= pasos; i++) {
    precios[i] = S * Math.pow(u, pasos - i) * Math.pow(d, i);
  }

  let valores = precios.map((precio) =>
    tipo === "call" ? Math.max(precio - K, 0) : Math.max(K - precio, 0)
  );

  for (let paso = pasos - 1; paso >= 0; paso--) {
    for (let i = 0; i <= paso; i++) {
      const precioActual = S * Math.pow(u, paso - i) * Math.pow(d, i);
      const valorEsperado = descuento * (p * valores[i] + (1 - p) * valores[i + 1]);
      if (americana) {
        const valorIntrinseco =
          tipo === "call" ? Math.max(precioActual - K, 0) : Math.max(K - precioActual, 0);
        valores[i] = Math.max(valorEsperado, valorIntrinseco);
      } else {
        valores[i] = valorEsperado;
      }
    }
  }
  return valores[0];
};

// Función combinada: valuación completa de un contrato
export const valuarContrato = ({ S, K, r, T, sigma, tipo, precioMercado }) => {
  const precioTeorico = blackScholes(S, K, r, T, sigma, tipo);
  const griegas = calcularGriegas(S, K, r, T, sigma, tipo);
  const precioBinomial = binomialCRR(S, K, r, T, sigma, 200, tipo, true);

  const resultado = {
    parametros: { S, K, r, T, sigma, tipo },
    precioTeoricoBSM: Number(precioTeorico.toFixed(4)),
    precioBinomialAmericana: Number(precioBinomial.toFixed(4)),
    griegas: {
      delta: Number(griegas.delta.toFixed(4)),
      gamma: Number(griegas.gamma.toFixed(4)),
      theta: Number(griegas.theta.toFixed(4)),
      vega: Number(griegas.vega.toFixed(4)),
      rho: Number(griegas.rho.toFixed(4)),
    },
  };

  if (precioMercado) {
    const iv = volatilidadImplicita(precioMercado, S, K, r, T, tipo);
    resultado.volatilidadImplicita = {
      valor: Number((iv.sigma * 100).toFixed(4)),
      iteraciones: iv.iteraciones,
      convergio: iv.convergio,
    };
  }

  return resultado;
};
