import express from "express";
import { query } from "./database.mjs";


const vehiculosRouter = express.Router();
vehiculosRouter.use(express.urlencoded({ extended: true }));
vehiculosRouter.use(express.json());


//Define la ruta para obtener los datos del vehiculo por ID
VehiculosEs.get("/:id", async function(req,res){
    try{
        const vehiculoId = req.params.id;
        const sql="CALL ConsultaCompletaPorID(?)";
        const results = await query(sql,[vehiculoId]);
        res.json(results[0]);
    }catch(error){
        console.error("Error al obtener vehiculo por ID: ",error);
        res.status(500).send("errror interno del servidor");
    }
})

export default vehiculosRouter;
