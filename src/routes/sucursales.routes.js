const express = require('express');
const sucursalesControlador = require('../controllers/sucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();


// AGREGAR SUCURSAL
api.post("/agregarSucursal", md_autenticacion.Auth, sucursalesControlador.AgregarSucursales)
// EDITAR SUCURSAL
api.put("/editarSucursal/:idSucursal", md_autenticacion.Auth, sucursalesControlador.editarSucursal)
// ELIMINAR SUCURSAL
api.delete('/eliminarSucursales/:idSucursal', md_autenticacion.Auth, sucursalesControlador.EliminarSucursales);

api.get('/obtenerSucursales', sucursalesControlador.ObtenerSucursales);
api.get('/obtenerSucursalesId/:idSucursal', sucursalesControlador.ObtenerSucursales);



module.exports = api;