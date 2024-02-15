// En tu archivo login.js

const express = require('express');
const router = express.Router();
const db = require('./database');

router.post('/', (req, res) => {
  const { usuario, contrasena } = req.body;

  // Consulta SQL para verificar las credenciales del usuario
  const consulta = `
    SELECT * 
    FROM empleados 
    WHERE Usuario = ? AND Contrasena = ? AND Estado = 1;
  `;
  
  // Ejecutar la consulta SQL
  db.query(consulta, [usuario, contrasena], (error, resultados, campos) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
      return;
    }

    if (resultados.length === 1) {
      // Las credenciales son válidas y el usuario está activo
      res.json({ mensaje: 'Inicio de sesión exitoso' });
    } else {
      // Las credenciales son incorrectas o el usuario está desactivado
      res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos o usuario desactivado' });
    }
  });
});

module.exports = router;
