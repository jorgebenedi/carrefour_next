const mongoose = require('mongoose');
const Categoria = require('../../models/categoria');
const cors = require('cors');
const express = require('express');
const app = express();
const Producto = require('../../models/producto');

// Habilitamos CORS para todas las rutas
app.use(cors());

module.exports = {
    //5. Controlador para recuperar categorías (raíz o subcategorías)
    Categorias: async (req, res, next) => {
        try {
            // Obtenemos el parámetro pathCat de la query
            let pathCat = req.query.pathCat;
            console.log("Lo que nos llega: ", pathCat);

            // Patrón por defecto para categorías raíz (sin guión)
            let _patron = '^[^\\-]+$';

            // Si no se proporciona pathCat, devolvemos error
            if (!pathCat) {
                return res.status(400).send({ codigo: 1, mensaje: 'Missing pathCat parameter', datos: [] });
            }

            // Si pathCat no es 'raices', construimos patrón para buscar subcategorías de esa categoría
            if (pathCat !== 'raices') {
                _patron = `^${pathCat}-[0-9]+$`;
            }

            // Creamos una expresión regular con el patrón construido
            let _regex = new RegExp(_patron);

            // Conectamos a la base de datos
            await mongoose.connect(`${process.env.URL_MONGODB}/${process.env.DB_MONGODB}`);

            // Buscamos las categorías que coincidan con el patrón en pathCategoria
            let _cats = await Categoria.find({ pathCategoria: { $regex: _regex } });

            // Si no se encuentran categorías, lanzamos error
            if (!_cats || _cats.length == 0) {
                throw new Error('no hay categorias para ese pathCategoria: ' + pathCat);
            }

            // Devolvemos las categorías encontradas
            res.status(200).send({ codigo: 0, mensaje: 'categorias recuperadas ok...', datos: _cats });

        } catch (error) {
            console.error('Error retrieving categories:', error);
            // En caso de error, devolvemos error 500
            res.status(500).send({ codigo: 1, mensaje: `Error retrieving categories: ${error.message}` });
        }
    },
    Productos: async (req, res, next) => {
        try {
            let pathCat = req.query.pathCat;
            console.log('parametros del loader de react-router-dom en RECUPERARPRODUCTOS....', pathCat);
    
            await mongoose.connect(`${process.env.URL_MONGODB}/${process.env.DB_MONGODB}`);
    
            // Utiliza expresión regular para encontrar productos cuyo pathCategoria empieza por pathCat
            let regex = new RegExp(`^${pathCat}`);
            let _prods = await Producto.find({ pathCategoria: { $regex: regex } });
    
            console.log('productos de...', pathCat, _prods?.map(p => `${p.nombre} (${p.precio}€)`));
    
            res.status(200).send({
                codigo: 0,
                mensaje: 'productos recuperados ok...',
                datos: _prods
            });
        } catch (error) {
            console.log('error al recuperar productos de categoria: ', error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'error al recuperar productos de categoria: ' + error
            });
        }
    }
    
}
