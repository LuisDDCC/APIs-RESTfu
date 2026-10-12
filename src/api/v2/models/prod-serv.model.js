
const camposPermitidos = [
    'id_prod_serv_pk',
    'id_prod_serv_ok',
    'id_prod_serv_bk',
    'id_prod_serv_ma_ok',
    'id_prod_serv_ma_bk',
    'des_prod_serv',
    'id_medida_ok',
    'id_medida_bk',
    'cat_prod_serv_estatus',
    'cat_prod_serv_archivo',
    'detail_row',
];

const camposSistema = [
    'id',
    'created_at',
    'updated_at',
];

export const validarProdServ = (datos) => {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw new Error('Los datos del producto deben ser un objeto');
    }

    const camposInvalidos = Object.keys(datos).filter(
        (campo) => !camposPermitidos.includes(campo)
    );

    if (camposInvalidos.length > 0) {
        throw new Error(
            `Campos no permitidos: ${camposInvalidos.join(', ')}`
        );
    }

    if (datos.cat_prod_serv_estatus !== undefined &&
        !Array.isArray(datos.cat_prod_serv_estatus)) {
        throw new Error('cat_prod_serv_estatus debe ser un arreglo');
    }

    if (datos.cat_prod_serv_archivo !== undefined &&
        !Array.isArray(datos.cat_prod_serv_archivo)) {
        throw new Error('cat_prod_serv_archivo debe ser un arreglo');
    }

    if (datos.detail_row !== undefined &&
        (datos.detail_row === null ||
         typeof datos.detail_row !== 'object' ||
         Array.isArray(datos.detail_row))) {
        throw new Error('detail_row debe ser un objeto');
    }

    return datos;
};

export default {
    tabla: 'cat_prod_serv',
    camposPermitidos,
    camposSistema,
    validar: validarProdServ,
};
