const moongoose = require('mongoose');

const direccionSchema = new moongoose.Schema({
        calle: { type: String, required: true, default: '' },
        cp: { type: String, required: true, match: /^[0-9]{5}$/, default: '00000-' },  
        provincia: { type: moongoose.Schema.Types.ObjectId, required: true },
        municipio: { type: String, required: true }, 
        esPrincipal: { type: Boolean, required: true },
        esFacturacion: { type: Boolean, required: true },
    }
);

module.exports = moongoose.model('Direccion', direccionSchema, 'direcciones'); 