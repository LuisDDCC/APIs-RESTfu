
const camposPermitidos = [
    'nombre',
    'email',
    'password',
];

const camposSistema = [
    'id',
    'password_hash',
    'creado',
    'created_at',
    'updated_at',
];

export const validarUsuario = (datos, parcial = false) => {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw new Error('Los datos del usuario deben ser un objeto');
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
        for (const campo of ['nombre', 'email', 'password']) {
            if (
                typeof datos[campo] !== 'string' ||
                datos[campo].trim() === ''
            ) {
                throw new Error(`${campo} es obligatorio`);
            }
        }
    }

    if (
        datos.nombre !== undefined &&
        (
            typeof datos.nombre !== 'string' ||
            datos.nombre.trim() === ''
        )
    ) {
        throw new Error('El nombre debe ser una cadena no vacía');
    }

    if (
        datos.email !== undefined &&
        (
            typeof datos.email !== 'string' ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)
        )
    ) {
        throw new Error('El email no tiene un formato válido');
    }

    if (
        datos.password !== undefined &&
        (
            typeof datos.password !== 'string' ||
            datos.password.length < 8
        )
    ) {
        throw new Error(
            'La contraseña debe tener al menos 8 caracteres'
        );
    }

    return datos;
};

export default {
    tabla: 'usuarios',
    camposPermitidos,
    camposSistema,
    validar: validarUsuario,
};
