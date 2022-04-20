const express = require('express');
const productoController = require('../controllers/producto.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregar', productoController.agregarProductos);
api.get('/obtener', productoController.obtenerProductos);
/*
api.get('/empresas/:idEmpresa', empresaControlador.ObtenerEmpresasId);
api.put('/editarEmpresas/:idEmpresa', empresaControlador.EditarEmpresas);
api.delete('/eliminarEmpresas/:idEmpresa', empresaControlador.EliminarEmpresas);
*/
module.exports = api;