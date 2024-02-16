import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './database.mjs';
import empleadosRouter from './empleados.mjs';
import estadoRouter from './Estado.mjs';
import loginRouter from './login.mjs';

const app = express();
const PORT = 4000;

// Middleware para permitir solicitudes CORS
app.use(cors());

// Middleware para analizar las solicitudes entrantes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas para los empleados
app.use('/empleados', empleadosRouter);

// Rutas para los estados
app.use('/Estado', estadoRouter);

// Rutas para los inicios de sesión
app.use('/login', loginRouter);

// Rutina para insertar un empleado de prueba
// const empleado = {
//   Nombre: 'John Doe',
//   Apellido: 'Doe',
//   Cargo: 'Gerente General',
//   Telefono: '555-1234',
//   CorreoElectronico: 'johndoe@example.com',
//   Usuario: 'johndoe',
//   ContrasenaHash: 'password123'
// };
// db.query('INSERT INTO Empleados SET ?', empleado, (error, results, fields) => {
//   if (error) {
//     console.error('Error al insertar el empleado: ' + error);
//     return;
//   }
//   console.log('Empleado insertado con éxito');
// });

// Iniciar el servidor
app.listen(PORT, function() {
  console.log('Servidor escuchando en el puerto ' + PORT);
});