import express from 'express';
import config from '../config/config.js';
import morgan from 'morgan';
import cors from 'cors';
import routeAPI from "../routes/index.js";
import '../config/database.config.js';


const app = express();
app.set('port', config.PORT);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const api = config.API_URL;
app.get(`${api}`, (req, res) => {
    res.send(`<h1>API v2 - Options PWA running</h1>`);
});

routeAPI(app);

export default app;