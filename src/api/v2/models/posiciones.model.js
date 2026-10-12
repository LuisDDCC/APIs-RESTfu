
const camposPermitidos = [
    'activo_subyacente',
    'fecha_consulta',
    'contratos',
];

const camposSistema = [
    'id',
    'created_at',
    'updated_at',
];

export const validarPosicion = (datos, parcial = false) => {
    if (
        !datos ||
        typeof datos !== 'object' ||
        Array.isArray(datos)
    ) {
        throw new Error(
            'Los datos de la posición deben ser un objeto'
        );
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
        if (datos.activo_subyacente === undefined) {
            throw new Error(
                'activo_subyacente es obligatorio'
            );
        }

        if (datos.contratos === undefined) {
            throw new Error(
                'contratos es obligatorio'
            );
        }
    }

    if (
        datos.activo_subyacente !== undefined &&
        (
            datos.activo_subyacente === null ||
            typeof datos.activo_subyacente !== 'object' ||
            Array.isArray(datos.activo_subyacente)
        )
    ) {
        throw new Error(
            'activo_subyacente debe ser un objeto'
        );
    }

    if (
        datos.contratos !== undefined &&
        !Array.isArray(datos.contratos)
    ) {
        throw new Error(
            'contratos debe ser un arreglo'
        );
    }

    return datos;
};

export default {
    tabla: 'posiciones',
    camposPermitidos,
    camposSistema,
    validar: validarPosicion,
};
