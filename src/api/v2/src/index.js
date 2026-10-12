import app from './app.js';
import config from '../config/config.js';

app.listen(app.get('puerto'), () => {
console.log(
  `Servidor está corriendo en: http://${config.HOST}:${app.get('puerto')}${config.API_URL}`
);
});