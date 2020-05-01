const express    = require('express');        // Utilizaremos express, aqui lo mandamos llamar
const app        = express();                 // definimos la app usando express
const bodyParser = require('body-parser'); //
const helmet = require('helmet');
const config = require('config');
const testRoutes = require('./src/routes');
const port = config.get('port');
const cors = require('cors');


app.use(helmet());
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', testRoutes);

// Iniciamos el servidor
app.listen(port);
console.log('Aplicación creada en el puerto: ' + port);