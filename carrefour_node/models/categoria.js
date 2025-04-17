const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema(
    {
        imagen: String,
        nombreCategoria: String,
        pathCategoria: String,
    }
);

module.exports = mongoose.model('Categoria', categoriaSchema, 'categorias');