// Importar express y la función de consulta desde el archivo de la base de datos
import express from 'express';
import { query } from './database.mjs';

// Crear un enrutador para los estados
const estadoRouter = express.Router();

// Middleware para analizar las solicitudes entrantes
estadoRouter.use(express.urlencoded({ extended: true }));
estadoRouter.use(express.json());

// Definir la ruta para obtener todos los estados
estadoRouter.get('/', async function(req, res) {
  try {
    // Consulta SQL para obtener todos los estados
    const sql = 'SELECT * FROM Estado';
    
    // Ejecutar la consulta y obtener los resultados
    const results = await query(sql);
    
    // Enviar los resultados como respuesta JSON
    res.json(results);
  } catch (error) {
    // Manejar errores
    console.error('Error al obtener estados:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Exportar el enrutador de estados
export default estadoRouter;
