const mongoose = require("mongoose");

const pedidoSchema=new mongoose.Schema(
{
    idPedido: String,
    idUsuario: String,
    idProducto: String,
    fecha: Date,
    cantidad: Number,
    precioTotal: Number,
    estado: String
}
);

module.exports= mongoose.model("Pedido", pedidoSchema, "pedidos")