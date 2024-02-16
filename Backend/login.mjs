import express from 'express';
import { query } from './database.mjs';

const router = express.Router();

router.post('/', async function(req, res) {
  const { usuario, ContrasenaHash } = req.body;

  // Consulta SQL para verificar las credenciales del usuario
  const consulta = `
    SELECT * 
    FROM empleados 
    WHERE Usuario = ? AND ContrasenaHash = ? AND Estado = 1;
  `;

  try {
    const [results] = await query(consulta, [usuario, ContrasenaHash]);
    if (results.length === 1) {
      // Las credenciales son válidas y el usuario está activo
      res.json({ message: 'Inicio de sesión exitoso' });
    } else {
      // Las credenciales son incorrectas o el usuario está desactivado
      res.status(401).json({ message: 'Usuario o contraseña incorrectos o usuario desactivado' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;