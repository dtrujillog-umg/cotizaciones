import express from "express";
import { query } from "./database.mjs";
import multer from "multer";
import fs from "fs";

const vehiculosRouter = express.Router();
vehiculosRouter.use(express.urlencoded({ extended: true }));
vehiculosRouter.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../Frontend/Images/nuevos/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

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


// Obtener vehículos por marca
vehiculosRouter.get("/porMarca", async function (req, res) {  
  const marca = req.query.marca;
  console.log(req.query)
  try {
    let results;
    if (marca === 'all') {
      results = await query("SELECT * FROM Vehiculos");
    } else {
      results = await query("SELECT V.VehiculoID, V.Modelo, V.Marca, V.Anio, V.PrecioGerente, V.PresioWeb, V.PrecioLista, V.Imagen, V.MarcaID FROM Vehiculos V INNER JOIN Marca M ON V.MarcaID = M.MarcaID WHERE M.MarcaID = ?", [marca]);
    }
    console.log("results", results);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener vehículos por marca:", error);
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
vehiculosRouter.post("/", upload.single('Imagen'), async function (req, res) {
  // Extraer la información del vehículo desde la solicitud
  const { Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, MarcaID } =
    req.body;

  // Obtener la imagen del cuerpo de la solicitud
  const Imagen = req.file ? req.file.filename : null;

  try {
    // Insertar el vehículo en la base de datos
    const results = await query(
      "INSERT INTO Vehiculos (Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, MarcaID, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, MarcaID, Imagen]
    );

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
        MarcaID,
        Imagen,
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
vehiculosRouter.put("/:id", upload.single('Imagen'), async function (req, res) {
  // Extraer la información del vehículo desde la solicitud
  const { Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, MarcaID } = req.body;

  // La imagen se guarda en req.file
  const Imagen = req.file ? req.file.filename : null;

  try {
    // Si se subió una nueva imagen, actualizar la imagen en la base de datos
    if (Imagen) {
      await query(
        "UPDATE Vehiculos SET Modelo = ?, Marca = ?, Anio = ?, PrecioGerente = ?, PresioWeb = ?, PrecioLista = ?, MarcaID = ?, Imagen = ? WHERE VehiculoID = ?",
        [Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, MarcaID,  Imagen, req.params.id]
      );
    } else {
      // Si no se subió una nueva imagen, no actualizar la imagen en la base de datos
      await query(
        "UPDATE Vehiculos SET Modelo = ?, Marca = ?, Anio = ?, PrecioGerente = ?, PresioWeb = ?, PrecioLista = ?, MarcaID = ? WHERE VehiculoID = ?",
        [Modelo, Marca, Anio, PrecioGerente, PresioWeb, PrecioLista, MarcaID, req.params.id]
      );
    }

    // Enviar una respuesta exitosa al cliente
    res.json({
      message: "Vehiculo actualizado con éxito",
    });
  } catch (error) {
    console.error("Error al actualizar vehiculo:", error);
    res.status(500).send("Error interno del servidor");
  }
});


//detalle de vehiculos

vehiculosRouter.get("/detalle/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const results = await query("CALL ConsultaCompletaPorID(?)", [id]);
    if (results.length === 0) {
      res.status(404).send("Vehiculo no encontrado");
      return;
    }
    // Ajustar la respuesta para enviar solo el objeto del vehículo
    res.json(results[0]);
  } catch (error) {
    console.error("Error al obtener el Vehiculo:", error);
    res.status(500).send("Error interno del servidor");
  }
});





// vehiculosRouter.get("/detalle/:id", async function(req,res){
//   try{
//       const vehiculoId = req.params.id;
//       const sql="CALL ConsultaCompletaPorID(?)";
//       const results = await query(sql,[vehiculoId]);
//       res.json(results.length === 0);
//   }catch(error){
//       console.error("Error al obtener vehiculo por ID: ",error);
//       res.status(500).send("errror interno del servidor");
//   }
// })


// Exporta el enrutador de vehículos como objeto predeterminado
export default vehiculosRouter;
