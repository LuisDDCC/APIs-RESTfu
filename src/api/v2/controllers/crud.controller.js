
const manejarError = (res, error) => {
    if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No encontrado' });
    }

    if (error.code === '23505') {
        return res.status(409).json({ error: 'Registro duplicado' });
    }

    // Errores de validación del modelo
    if (!error.code && error.message) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({
        error: 'Error interno del servidor',
    });
};

export const crearControlador = (servicio) => ({
    listar: async (req, res) => {
        try { res.json(await servicio.listar()); } catch (e) { manejarError(res, e); }
    },
    obtener: async (req, res) => {
        try { res.json(await servicio.obtener(req.params.id)); } catch (e) { manejarError(res, e); }
    },
    crear: async (req, res) => {
        try { res.status(201).json(await servicio.crear(req.body)); } catch (e) { manejarError(res, e); }
    },
    actualizar: async (req, res) => {
        try { res.json(await servicio.actualizar(req.params.id, req.body)); } catch (e) { manejarError(res, e); }
    },
    eliminar: async (req, res) => {
        try { await servicio.eliminar(req.params.id); res.status(204).end(); } catch (e) { manejarError(res, e); }
    },
});