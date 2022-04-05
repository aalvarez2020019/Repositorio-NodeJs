const express = require('express');
const sucursalesControlador = require('../controllers/sucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarSucursales', sucursalesControlador.AgregarSucursales);
api.put('/editarSucursales/:idSucursal', sucursalesControlador.EditarSucursales);
api.delete('/eliminarSucursales/:idSucursal', sucursalesControlador.EliminarSucursales);

api.get('/obtenerSucursales', sucursalesControlador.ObtenerSucursales);
api.get('/obtenerSucursalesId/:idSucursal', sucursalesControlador.ObtenerSucursales);



module.exports = api;