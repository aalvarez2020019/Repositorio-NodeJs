const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresasSchema = Schema({
    
    empresa: String,
    actividades: String,
    
});

module.exports = mongoose.model('Empresas', EmpresasSchema)