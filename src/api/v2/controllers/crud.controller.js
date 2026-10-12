// Módulo: Controlador Genérico CRUD (Patrón Factory)

//Interceptamos los códigos de error comunes (como los de PostgreSQL/Supabase) 
//para transformarlos en respuestas HTTP claras hacia el cliente.

const manejarError = (res, error) => {
    if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    
    if (error.code === '23505') {
        return res.status(409).json({ error: 'El registro ya existe en el sistema' });
    }
    
    // Cualquier otro fallo inesperado se maneja como error de servidor (500)
    return res.status(500).json({ 
        error: 'Error interno del servidor', 
        detalles: error.message 
    });
};

export const crearControlador = (servicio) => ({
    
    // Obtiene el listado completo de elementos
    listar: async (req, res) => {
        try {
            const datos = await servicio.listar();
            return res.json(datos);
        } catch (e) {
            return manejarError(res, e);
        }
    },

    // Consulta un registro individual filtrado por su ID
    obtener: async (req, res) => {
        try {
            const dato = await servicio.obtener(req.params.id);
            return res.json(dato);
        } catch (e) {
            return manejarError(res, e);
        }
    },

    // Registra un nuevo elemento enviando el payload en el body
    crear: async (req, res) => {
        try {
            const nuevoDato = await servicio.crear(req.body);
            return res.status(201).json(nuevoDato);
        } catch (e) {
            return manejarError(res, e);
        }
    },

    // Modifica un recurso existente utilizando su ID
    actualizar: async (req, res) => {
        try {
            const datoActualizado = await servicio.actualizar(req.params.id, req.body);
            return res.json(datoActualizado);
        } catch (e) {
            return manejarError(res, e);
        }
    },

    // Elimina un recurso del sistema por su ID
    eliminar: async (req, res) => {
        try {
            await servicio.eliminar(req.params.id);
            return res.status(204).end(); // Respuesta exitosa sin contenido
        } catch (e) {
            return manejarError(res, e);
        }
    },
});