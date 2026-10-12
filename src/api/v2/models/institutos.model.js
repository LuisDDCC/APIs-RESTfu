
const camposPermitidos = [
    'id_instituto_ok',
    'id_instituto_bk',
    'des_instituto',
    'alias',
    'matriz',
    'giro',
    'id_instituto_sup_ok',
];

const camposSistema = [
    'id',
    'created_at',
    'updated_at',
];

export const validarInstituto = (datos, parcial = false) => {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw new Error('Los datos del instituto deben ser un objeto');
    }

    const camposInvalidos = Object.keys(datos).filter(
        (campo) => !camposPermitidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
        throw new Error(
            `Campos no permitidos: ${camposInvalidos.join(', ')}`
        );
    }

    if (!parcial && !datos.id_instituto_ok) {
        throw new Error('id_instituto_ok es obligatorio');
    }

    return datos;
};

export default {
    tabla: 'cat_institutos',
    camposPermitidos,
    camposSistema,
    validar: validarInstituto,
};
