const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SucursalesSchema = Schema({
    
    nombreSucursal: String,
    direccionSucursal: String,
    
});

module.exports = mongoose.model('Sucursales', SucursalesSchema)