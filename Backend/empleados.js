const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Obtener todos los empleados
// router.get('/', function(req, res) {
//   db.query('SELECT * FROM Empleados', function(error, results, fields) {
//     if (error) {
//       console.error('Error al obtener empleados:', error);
//       res.status(500).send('Error interno del servidor');
//       return;
//     }
//     res.json(results);
//     // console.log(results);
//   });
// });

router.get('/', function(req, res) {
  const query = `
    SELECT 
        E.EmpleadoID, 
        E.Nombre, 
        E.Apellido, 
        E.Cargo, 
        E.Telefono, 
        E.CorreoElectronico,
        E.Usuario,
        E.Contrasena,
        ES.Estado
    FROM 
        Empleados E
    INNER JOIN 
        Estado ES ON E.Estado = ES.EstadoID
  `;
  db.query(query, function(error, results, fields) {
    if (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(results);
    // console.log(results);
  });
});


// Obtener un empleado por su ID
router.get('/:id', function(req, res) {
  const id = req.params.id;
  db.query('SELECT * FROM Empleados WHERE EmpleadoID = ?', id, function(error, results, fields) {
    if (error) {
      console.error('Error al obtener el empleado:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }
    if (results.length === 0) {
      // Si no se encuentra ningún empleado con el ID dado, devolver un mensaje de error
      res.status(404).send('Empleado no encontrado');
      return;
    }
    // Si se encuentra el empleado, devolverlo como respuesta
    res.json(results[0]);
  });
});


// Agregar un nuevo empleado
router.post('/', function(req, res) {
  const empleado = req.body;
  db.query('INSERT INTO Empleados SET ?', empleado, function(error, results, fields) {
    if (error) {
      console.error('Error al agregar empleado:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json({ message: 'Empleado agregado con éxito', empleado });
  });
});

// Actualizar un empleado existente
router.put('/:id', function(req, res) {
  const id = req.params.id;
  const empleado = req.body;
  db.query('UPDATE Empleados SET ? WHERE EmpleadoID = ?', [empleado, id], function(error, results, fields) {
    if (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json({ message: 'Empleado actualizado con éxito', empleado });
  });
});

// Eliminar un empleado
router.delete('/:id', function(req, res) {
  const id = req.params.id;
  db.query('DELETE FROM Empleados WHERE EmpleadoID = ?', id, function(error, results, fields) {
    if (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json({ message: 'Empleado eliminado con éxito', id });
  });
});

module.exports = router;
