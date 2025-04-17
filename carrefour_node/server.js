require('dotenv').config(); //<---- lee el fichero .env y crea variables de entorno delicadas o secretas (no visibles)
const express = require('express');
const mongoose = require('mongoose');
const configPipeline = require('./config_pipeline');
const miServidorWeb = express();

// Conexión a MongoDB
mongoose.connect(`${process.env.URL_MONGODB}/${process.env.DB_MONGODB}`, {

}).then(() => {
  console.log('Conexión a MongoDB exitosa');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

configPipeline(miServidorWeb);

// Levantar el servidor web
miServidorWeb.listen(3003, () => console.log('...servidor WEB EXPRESS escuchando peticiones en puerto 3003.....'));