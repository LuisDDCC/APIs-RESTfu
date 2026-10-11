import { Router } from 'express';
import config from '../../../config/config.js';

import prodServRoutes from './prodServ.routes.js';
import institutosRoutes from './institutos.routes.js';
import quantRoutes from './quant.routes.js';
import wheelRoutes from './wheel.routes.js';

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    app.use(api, router);

    router.use('/prod-serv', prodServRoutes);
    router.use('/institutos', institutosRoutes);
    router.use('/quant', quantRoutes);
    router.use('/wheel', wheelRoutes);

    return router;
};

export default routerAPI;