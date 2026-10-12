
const camposPermitidos = [
    'usuario',
    'estrategia',
    'fecha_apertura',
    'estado',
    'contratos',
    'resultado_evaluacion',
];

const camposSistema = [
    'id',
    'created_at',
    'updated_at',
];

export const validarCadenaPosiciones = (datos, parcial = false) => {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw new Error('Los datos de la cadena deben ser un objeto');
    }

    const camposInvalidos = Object.keys(datos).filter(
        (campo) => !camposPermitidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
        throw new Error(
            `Campos no permitidos: ${camposInvalidos.join(', ')}`
        );
    }

    if (!parcial) {
        const obligatorios = [
            'usuario',
            'estrategia',
            'fecha_apertura',
            'estado',
        ];

        const faltantes = obligatorios.filter(
            (campo) => datos[campo] === undefined
        );

        if (faltantes.length > 0) {
            throw new Error(
                `Campos obligatorios: ${faltantes.join(', ')}`
            );
        }
    }

    const objetosJSON = [
        'usuario',
        'estrategia',
        'resultado_evaluacion',
    ];

    for (const campo of objetosJSON) {
        if (
            datos[campo] !== undefined &&
            (
                datos[campo] === null ||
                typeof datos[campo] !== 'object' ||
                Array.isArray(datos[campo])
            )
        ) {
            throw new Error(`${campo} debe ser un objeto`);
        }
    }

    if (
        datos.contratos !== undefined &&
        !Array.isArray(datos.contratos)
    ) {
        throw new Error('contratos debe ser un arreglo');
    }

    if (
        datos.fecha_apertura !== undefined &&
        (
            typeof datos.fecha_apertura !== 'string' ||
            Number.isNaN(Date.parse(datos.fecha_apertura))
        )
    ) {
        throw new Error('fecha_apertura debe ser una fecha válida');
    }

    if (
        datos.estado !== undefined &&
        typeof datos.estado !== 'string'
    ) {
        throw new Error('estado debe ser una cadena de texto');
    }

    return datos;
};

export default {
    tabla: 'cadena_posiciones',
    camposPermitidos,
    camposSistema,
    validar: validarCadenaPosiciones,
};
