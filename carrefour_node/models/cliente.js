const mongoose = require('mongoose');

// Definir el esquema para la colección 'clientes'
const cuentaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  telefono: { type: String, required: false },
  tarjetaCarrefour: {type: String, required: true },
  dninif: { 
    tipo: { type: String, required: true },
    numero: { type: String, required: true } // Agregado un campo para el número del documento
  },
  cp: { type: String, required: false },
  activada: { type: Boolean, default: false },
  cuenta: { 
    email: { type: String, required: true }, // Corregido: faltaba `true` en `required`
    password: { type: String, required: true }
  },
  direcciones: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion', ref: 'Direccion'} ] ,
  pedidos: [  ]
}, 
); 

// Crear el modelo basado en el esquema
module.exports = mongoose.model('Cliente', cuentaSchema, 'clientes');
