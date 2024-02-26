import express from 'express';
import { query } from './database.mjs';

const router = express.Router();

router.get('/', async function(req, res) {
  try {
    const sql = `SELECT * FROM Vehiculos`;
    const results = await query(sql); // Aquí cambiamos 'query' a 'sql'
    res.json(results);
  } catch (error) {
    console.error('Error al obtener Vehiculos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;