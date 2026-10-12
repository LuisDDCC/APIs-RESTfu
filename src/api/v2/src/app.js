import express from 'express';
import config from '../config/config.js';
import morgan from 'morgan';
import cors from 'cors';
import routeAPI from "../routes/index.js";
import '../config/database.config.js';

const app = express();
app.set('puerto', config.PORT);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const api = config.API_URL;
app.get(`${api}`, (req, res) => {
    res.send(`<h1>API v2 - Opciones PWA en funcionamiento</h1>`);
});

routeAPI(app); 

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;