// RUTAS DEL USUARIO
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

// Agregar Usuario
api.post('/agregarUsuario', usuarioController.AgregarUsuario);
// Editar Usuario
api.put('/editarUsuarios/:idUsuario', md_autenticacion.Auth, usuarioController.editarUsuarios);
// Eliminar Usuario
api.put('/eliminarUsuario/:idUsuario', md_autenticacion.Auth, usuarioController.eliminarUsuarios);
// Registrar Usuario
api.post('/registrar', usuarioController.Registrar);
// Login Usuario
api.post('/login', usuarioController.Login);

module.exports = api;