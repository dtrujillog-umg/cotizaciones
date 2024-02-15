const express = require('express');
const bodyParser = require('body-parser');
const empleadosRouter = require('./empleados');
const estadoRouter = require('./Estado');
const loginRouter = require('./login');


const cors = require('cors'); // Importa el paquete cors

const app = express();
const PORT = 4000;

// Middleware para permitir solicitudes CORS
app.use(cors());
// Middleware para analizar las solicitudes entrantes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas para los empleados
app.use('/empleados', empleadosRouter);
app.use('/Estado', estadoRouter);
app.use('/login', loginRouter);


// Iniciar el servidor
app.listen(PORT, function() {
  console.log('Servidor escuchando en el puerto ' + PORT);
});

