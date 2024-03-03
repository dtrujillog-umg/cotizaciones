import express from "express";
import { query } from "./database.mjs";
import fs from "fs";

const vehiculosRouter = express.Router();
vehiculosRouter.use(express.urlencoded({ extended: true }));
vehiculosRouter.use(express.json());

// Define tus rutas para vehículos aquí, similar a como lo hiciste para vehiculos

vehiculosRouter.get("/", async function (req, res) {
  try {
    const sql = "SELECT * FROM Vehiculos";
    const results = await query(sql);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener un vehiculo por su ID
vehiculosRouter.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const results = await query(
      "SELECT * FROM Vehiculos WHERE VehiculoID = ?",
      [id]
    ); // Cambio aquí
    if (results.length === 0) {
      // Si no se encuentra ningún vehiculo con el ID dado, devolver un mensaje de error
      res.status(404).send("Vehiculo no encontrado");
      return;
    }
    // Si se encuentra el vehiculo, devolverlo como respuesta
    res.json(results[0]);
  } catch (error) {
    console.error("Error al obtener el Vehiculo:", error);
    res.status(500).send("Error interno del servidor");
  }
});



//crear un nuevo vehiculo
vehiculosRouter.post("/", async function (req, res) {
  // Extraer la información del vehículo desde la solicitud
  const { Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, Imagen } =
    req.body;

  // Obtener la imagen del cuerpo de la solicitud
  const imagenData = req.body.ImagenBase64; // Asegúrate de enviar la imagen como una cadena codificada en base64 desde el cliente

  try {
    // Insertar el vehículo en la base de datos
    const results = await query(
      "INSERT INTO Vehiculos (Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, Imagen]
    );

    // Generar el nombre del archivo basado en el ID del vehículo, modelo y marca
    const nombreArchivo = `${results.insertId}_${Modelo}_${Marca}.jpg`;

    // Verificar si la imagen se recibió correctamente desde el cliente
    if (typeof imagenData !== 'undefined') {
      // Guardar la imagen en el sistema de archivos del servidor
      fs.writeFileSync(
        `ruta/de/la/carpeta/img/${nombreArchivo}`,
        imagenData,
        "base64"
      );
    } else {
      console.error("La imagen no se recibió correctamente desde el cliente");
      // Aquí puedes decidir qué hacer en caso de que la imagen no se haya recibido correctamente
    }

    // Enviar una respuesta exitosa al cliente
    res.json({
      message: "Vehiculo agregado con éxito",
      vehiculo: {
        VehiculoID: results.insertId,
        Modelo,
        Marca,
        Anio,
        PrecioGerente,
        PresioWeb,
        PrecioLista,
        Imagen: nombreArchivo,
      },
    });
  } catch (error) {
    console.error("Error al agregar vehiculo:", error);
    res.status(500).send("Error interno del servidor");
  }
});


// Eliminar un vehiculo
vehiculosRouter.delete("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const results = await query("DELETE FROM Vehiculos WHERE VehiculoID = ?", [
      id,
    ]); // Cambio aquí
    res.json({ message: "Vehiculo eliminado con éxito", id });
  } catch (error) {
    console.error("Error al eliminar vehiculo:", error);
    res.status(500).send("Error interno del servidor");
  }
});



// Actualizar un vehiculo existente
vehiculosRouter.put("/:id", async function (req, res) {
  const id = req.params.id;
  const empleado = req.body;
  try {
    const results = await query("UPDATE Vehiculos SET ? WHERE VehiculoID = ?", [
      empleado,
      id,
    ]);
    res.json({ message: "Vehiculo actualizado con éxito", empleado });
  } catch (error) {
    console.error("Error al actualizar vehiculo:", error);
    res.status(500).send("Error interno del servidor");
  }
});


// Exporta el enrutador de vehículos como objeto predeterminado
export default vehiculosRouter;
