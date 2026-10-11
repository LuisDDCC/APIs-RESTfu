/**
 * MÓDULO F0 - MOTOR CUANTITATIVO CENTRAL (CORE QUANT)
 * Implementa: Black-Scholes-Merton, Griegas, y Volatilidad Implícita (Newton-Raphson)
 */

// ---------- Funciones auxiliares de distribución normal ----------

// Función de densidad de probabilidad normal estándar φ(x)
function normPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// Función de distribución acumulada normal estándar N(x)
// Aproximación de Abramowitz & Stegun
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

// ---------- Cálculo de d1 y d2 ----------
function calcD1D2(S, K, r, T, sigma) {
  const d1 =
    (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  return { d1, d2 };
}

// ---------- Modelo Black-Scholes-Merton ----------
function blackScholes(S, K, r, T, sigma, tipo = "call") {
  const { d1, d2 } = calcD1D2(S, K, r, T, sigma);

  if (tipo === "call") {
    return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  } else {
    return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
  }
}

// ---------- Cálculo de las Griegas ----------
function calcularGriegas(S, K, r, T, sigma, tipo = "call") {
  const { d1, d2 } = calcD1D2(S, K, r, T, sigma);

  const delta =
    tipo === "call" ? normCDF(d1) : normCDF(d1) - 1;

  const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));

  const vega = S * normPDF(d1) * Math.sqrt(T) / 100; // por 1% de cambio en IV

  let theta;
  if (tipo === "call") {
    theta =
      (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) -
        r * K * Math.exp(-r * T) * normCDF(d2)) /
      365; // por día
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
}

// ---------- Volatilidad Implícita por Newton-Raphson ----------
function volatilidadImplicita(
  precioMercado,
  S,
  K,
  r,
  T,
  tipo = "call",
  sigmaInicial = 0.3,
  tolerancia = 1e-6,
  maxIteraciones = 100
) {
  let sigma = sigmaInicial;

  for (let i = 0; i < maxIteraciones; i++) {
    const precioBSM = blackScholes(S, K, r, T, sigma, tipo);
    const { vega } = calcularGriegas(S, K, r, T, sigma, tipo);
    const vegaReal = vega * 100; // deshacer el /100 para el newton-raphson

    const diferencia = precioBSM - precioMercado;

    if (Math.abs(diferencia) < tolerancia) {
      return { sigma, iteraciones: i + 1, convergio: true };
    }

    if (vegaReal === 0) {
      return { sigma, iteraciones: i + 1, convergio: false, error: "Vega es cero" };
    }

    sigma = sigma - diferencia / vegaReal;

    if (sigma <= 0) sigma = 0.001; // evita valores negativos/absurdos
  }

  return { sigma, iteraciones: maxIteraciones, convergio: false };
}

// ---------- Modelo Binomial (Cox-Ross-Rubinstein) para opciones americanas ----------
function binomialCRR(S, K, r, T, sigma, pasos = 100, tipo = "call", americana = true) {
  const dt = T / pasos;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);
  const descuento = Math.exp(-r * dt);

  // precios del subyacente en el vencimiento
  let precios = [];
  for (let i = 0; i <= pasos; i++) {
    precios[i] = S * Math.pow(u, pasos - i) * Math.pow(d, i);
  }

  // valor de la opción en el vencimiento
  let valores = precios.map((precio) =>
    tipo === "call" ? Math.max(precio - K, 0) : Math.max(K - precio, 0)
  );

  // inducción hacia atrás
  for (let paso = pasos - 1; paso >= 0; paso--) {
    for (let i = 0; i <= paso; i++) {
      const precioActual = S * Math.pow(u, paso - i) * Math.pow(d, i);
      const valorEsperado =
        descuento * (p * valores[i] + (1 - p) * valores[i + 1]);

      if (americana) {
        const valorIntrinseco =
          tipo === "call"
            ? Math.max(precioActual - K, 0)
            : Math.max(K - precioActual, 0);
        valores[i] = Math.max(valorEsperado, valorIntrinseco);
      } else {
        valores[i] = valorEsperado;
      }
    }
  }

  return valores[0];
}

// =====================================================================
// DEMOSTRACIÓN / PRUEBA DEL MOTOR (esto genera la evidencia real)
// =====================================================================

console.log("========================================================");
console.log(" MÓDULO F0 - MOTOR CUANTITATIVO CENTRAL");
console.log(" Prueba de valuación de opciones financieras");
console.log("========================================================\n");

// Parámetros de ejemplo (una acción hipotética)
const S = 100;      // Precio actual del activo subyacente
const K = 105;       // Precio de ejercicio (strike)
const r = 0.05;      // Tasa de interés libre de riesgo (5% anual)
const T = 0.5;       // Tiempo a vencimiento (0.5 años = 6 meses)
const sigma = 0.25;  // Volatilidad (25% anual)

console.log("Parámetros de entrada:");
console.log(`  Precio del activo (S):     $${S}`);
console.log(`  Precio de ejercicio (K):   $${K}`);
console.log(`  Tasa libre de riesgo (r):  ${(r * 100).toFixed(2)}%`);
console.log(`  Tiempo a vencimiento (T):  ${T} años`);
console.log(`  Volatilidad (σ):           ${(sigma * 100).toFixed(2)}%\n`);

// --- 1. Valuación Black-Scholes ---
console.log("--------------------------------------------------------");
console.log("1. VALUACIÓN BLACK-SCHOLES-MERTON (opción europea)");
console.log("--------------------------------------------------------");
const precioCall = blackScholes(S, K, r, T, sigma, "call");
const precioPut = blackScholes(S, K, r, T, sigma, "put");
console.log(`  Precio teórico CALL: $${precioCall.toFixed(4)}`);
console.log(`  Precio teórico PUT:  $${precioPut.toFixed(4)}\n`);

// --- 2. Griegas ---
console.log("--------------------------------------------------------");
console.log("2. GRIEGAS (sensibilidades) - para la opción CALL");
console.log("--------------------------------------------------------");
const griegasCall = calcularGriegas(S, K, r, T, sigma, "call");
console.log(`  Delta (Δ): ${griegasCall.delta.toFixed(4)}`);
console.log(`  Gamma (Γ): ${griegasCall.gamma.toFixed(4)}`);
console.log(`  Theta (Θ): ${griegasCall.theta.toFixed(4)}  (por día)`);
console.log(`  Vega  (ν): ${griegasCall.vega.toFixed(4)}  (por 1% de IV)`);
console.log(`  Rho   (ρ): ${griegasCall.rho.toFixed(4)}  (por 1% de tasa)\n`);

// --- 3. Volatilidad Implícita ---
console.log("--------------------------------------------------------");
console.log("3. VOLATILIDAD IMPLÍCITA (Newton-Raphson)");
console.log("--------------------------------------------------------");
const precioObservadoMercado = 7.50; // supongamos que el mercado cotiza la call en $7.50
const resultadoIV = volatilidadImplicita(precioObservadoMercado, S, K, r, T, "call");
console.log(`  Precio observado en mercado: $${precioObservadoMercado}`);
console.log(`  Volatilidad implícita estimada: ${(resultadoIV.sigma * 100).toFixed(4)}%`);
console.log(`  Iteraciones necesarias: ${resultadoIV.iteraciones}`);
console.log(`  ¿Convergió?: ${resultadoIV.convergio ? "Sí" : "No"}\n`);

// --- 4. Modelo Binomial (para comparar con Black-Scholes) ---
console.log("--------------------------------------------------------");
console.log("4. MODELO BINOMIAL (Cox-Ross-Rubinstein) - opción americana");
console.log("--------------------------------------------------------");
const precioBinomialCall = binomialCRR(S, K, r, T, sigma, 200, "call", true);
const precioBinomialPut = binomialCRR(S, K, r, T, sigma, 200, "put", true);
console.log(`  Precio CALL americana (200 pasos): $${precioBinomialCall.toFixed(4)}`);
console.log(`  Precio PUT americana (200 pasos):  $${precioBinomialPut.toFixed(4)}`);
console.log(`  (Comparar con BSM: Call=$${precioCall.toFixed(4)}, Put=$${precioPut.toFixed(4)})\n`);

console.log("========================================================");
console.log(" FIN DE LA PRUEBA - Motor F0 funcionando correctamente");
console.log("========================================================");

module.exports = {
  blackScholes,
  calcularGriegas,
  volatilidadImplicita,
  binomialCRR,
  normCDF,
  normPDF,
};