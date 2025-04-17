const mongoose = require('mongoose');

const provinciaSchemea = new mongoose.Schema(
    {
        CPRO: String,
        PRO: String,
        CCOM: String,
    }
);

module.exports = mongoose.model('Provincia', provinciaSchemea, 'provincias');