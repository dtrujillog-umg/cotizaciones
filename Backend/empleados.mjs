import express from 'express';
import { query } from './database.mjs';
import bcrypt from 'bcrypt';

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Obtener todos los empleados
router.get("/", async function (req, res) {
  try {
    const sql = `
      SELECT 
          E.EmpleadoID, 
          E.Nombre, 
          E.Apellido, 
          E.Cargo, 
          E.Telefono, 
          E.CorreoElectronico,
          E.Usuario,
          E.ContrasenaHash,
          ES.Estado
      FROM 
          Empleados E
      INNER JOIN 
          Estado ES ON E.Estado = ES.EstadoID
    `;
    const results = await query(sql);   
    res.json(results);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener un empleado por su ID
router.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const results = await query(
      "SELECT * FROM Empleados WHERE EmpleadoID = ?",
      [id]
    ); // Cambio aquí
    if (results.length === 0) {
      // Si no se encuentra ningún empleado con el ID dado, devolver un mensaje de error
      res.status(404).send("Empleado no encontrado");
      return;
    }
    // Si se encuentra el empleado, devolverlo como respuesta
    res.json(results[0]);
  } catch (error) {
    console.error("Error al obtener el empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Agregar un nuevo empleado
router.post("/", async function (req, res) {
  const empleado = req.body;
  try {
      // Hashear la contraseña antes de insertar el empleado
      const salt = await bcrypt.genSalt(10);
      empleado.Usuario = empleado.Usuario.toLowerCase();
      empleado.ContrasenaHash = await bcrypt.hash(empleado.ContrasenaHash, salt);

      const results = await query('INSERT INTO Empleados SET ?', [empleado]);
      res.json({ message: 'Empleado agregado con éxito', results });
  } catch (error) {
      console.error('Error al agregar empleado:', error);
      res.status(500).send('Error interno del servidor');
  }
});

// Actualizar un empleado existente
router.put("/:id", async function (req, res) {
  const id = req.params.id;
  const empleado = req.body;
  try {    
    // Hashear la contraseña antes de insertar el empleado
    if (empleado.ContrasenaHash) {
      const salt = await bcrypt.genSalt(10);
      empleado.Usuario = empleado.Usuario.toLowerCase();
      empleado.ContrasenaHash = await bcrypt.hash(empleado.ContrasenaHash, salt);
    }

    const results = await query("UPDATE Empleados SET ? WHERE EmpleadoID = ?", [
      empleado,
      id,
    ]);
    res.json({ message: "Empleado actualizado con éxito", results });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Eliminar un empleado
router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const results = await query("DELETE FROM Empleados WHERE EmpleadoID = ?", [
      id,
    ]);
    res.json({ message: "Empleado eliminado con éxito", id });
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
