const moongoose = require('mongoose');

const municipioSchema = new moongoose.Schema(
    {
        CUN: String,
        CPRO: String,
        CCOM: String,
        DMUN50: String,
    }
);

module.exports = moongoose.model('Municipio', municipioSchema, 'municipios');