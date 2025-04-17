const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routingCliente = require('./config_routing/endpointsCliente');
const routingServidor = require('./config_routing/endpointsServidor');

module.exports = function(serverWeb) {
    serverWeb.use(cors());
    serverWeb.use(express.json());
    serverWeb.use(express.urlencoded({ extended: false }));
    serverWeb.use(cookieParser());

    //middlewares de enrutamiento
    serverWeb.use('/api/zonaCliente', routingCliente);
    serverWeb.use('/api/zonaTienda', routingServidor);

}
