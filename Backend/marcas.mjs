import express from "express";
import { query } from "./database.mjs";

const marcasRouter = express.Router();
marcasRouter.use(express.urlencoded({ extended: true }));
marcasRouter.use(express.json());


// Obtener todas las marcas
marcasRouter.get("/", async function (req, res) {
  try {
    const sql = "SELECT * FROM Marca";
    const results = await query(sql);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener una marca por su ID
marcasRouter.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const results = await query(
      "SELECT * FROM Marca WHERE MarcaID = ?",
      [id]
    );
    if (results.length === 0) {
      res.status(404).send("Marca no encontrada");
      return;
    }
    res.json(results[0]);
  } catch (error) {
    console.error("Error al obtener la marca:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Crear una nueva marca
marcasRouter.post("/", async function (req, res) {
  const { NombreMarca } = req.body;
  try {
    await query(
      "INSERT INTO Marca (NombreMarca) VALUES (?)",
      [NombreMarca]
    );
    res.send("Marca creada exitosamente");
  } catch (error) {
    console.error("Error al crear la marca:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar una marca
marcasRouter.put("/:id", async function (req, res) {
  const id = req.params.id;
  const { NombreMarca } = req.body;
  try {
    await query(
      "UPDATE Marca SET NombreMarca = ? WHERE MarcaID = ?",
      [NombreMarca, id]
    );
    res.send("Marca actualizada exitosamente");
  } catch (error) {
    console.error("Error al actualizar la marca:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Exportar el valor de marcasRouter como valor predeterminado
export default marcasRouter;