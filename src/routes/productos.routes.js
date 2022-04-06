
const express = require('express');
const productoController = require('../controllers/productos.controller');
var api = express.Router();
api.get('/productos', productoController.ObtenerProductos);
api.get('/productos/:idProductos', productoController.ObtenerProductoId);
api.get('/buscarNombreProd/:nombreProducto', productoController.ObtenerProductoNombre);
api.post('/agregarProductos', productoController.AgregarProducto);
api.put('/editarProductos/:idProducto', productoController.EditarProducto);
api.delete('/eliminarProducto/:idProducto', productoController.EliminarProducto);
api.put('/stockProducto/:idProducto', productoController.stockProducto);

module.exports = api;