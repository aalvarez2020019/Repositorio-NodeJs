// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const EmpresaRutas = require('./src/routes/empresa.routes');
const UsuarioRutas = require('./src/routes/usuario.routes');
const SucursalRutas = require('./src/routes/sucursales.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', EmpresaRutas, UsuarioRutas, SucursalRutas);


module.exports = app;