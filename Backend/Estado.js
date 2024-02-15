const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Obtener todos los empleados
router.get('/', function(req, res) {
  db.query('SELECT * FROM Estado', function(error, results, fields) {
    if (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(results);
    // console.log(results);
  });
});


module.exports = router;
