const mongoose = require('mongoose');

const productoSchema=new mongoose.Schema(
    {
        nombre: String,
        imágenes: [String],
        pathCategoria: String,
        precio: Number,
        precioKg: Number,
        caracteristicas: String,
        valoraciones: []
    }
);

module.exports=mongoose.model("Producto",productoSchema, "productos")