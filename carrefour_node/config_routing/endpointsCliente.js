const express = require('express');
const routingCliente = express.Router();
const clienteEndPointsController = require('./controllers/clienteEndPointsController');

routingCliente.post('/Login', clienteEndPointsController.Login);
routingCliente.post('/Registro', clienteEndPointsController.Registro);
routingCliente.post('/ComprobarEmail', clienteEndPointsController.ComprobarEmail);
routingCliente.post('/ActivarCuenta', clienteEndPointsController.ActivarCuenta);
routingCliente.post('/VerificarCode', clienteEndPointsController.VerificarCode);

module.exports = routingCliente;