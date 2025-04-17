const express = require('express');
const servidorEndPointsController = require('./controllers/servidorEndPointsController');

const routingServidor = express.Router();

routingServidor.get('/Categorias', servidorEndPointsController.Categorias);
routingServidor.get('/Productos', servidorEndPointsController.Productos);

module.exports=routingServidor;

