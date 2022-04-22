// RUTAS DEL USUARIO
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

// LOGIN
api.post('/login', usuarioController.Login);
api.post('/registro', usuarioController.registrarEmpresas);
api.put('/editarEmpresa/:idUsuario', md_autenticacion.Auth, usuarioController.EditarEmpresa);
api.delete('/eliminarEmpresa/:idUsuario', md_autenticacion.Auth , usuarioController.EliminarEmpresas);


module.exports = api;