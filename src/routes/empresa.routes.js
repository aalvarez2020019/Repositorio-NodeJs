const express = require('express');
const empresaControlador = require('../controllers/empresa.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarEmpresas', empresaControlador.AgregarEmpresas);
api.get('/empresas', empresaControlador.ObtenerEmpresas);
api.get('/empresas/:idEmpresa', empresaControlador.ObtenerEmpresasId);
api.put('/editarEmpresas/:idEmpresa', empresaControlador.EditarEmpresas);
api.delete('/eliminarEmpresas/:idEmpresa', empresaControlador.EliminarEmpresas);

module.exports = api;
