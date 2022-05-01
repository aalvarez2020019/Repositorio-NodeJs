const express = require('express');
const productoSucursalController = require('../controllers/productosSucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

// Ver productos por sucursales Id
api.get('/VerProductosPorSucursales/:idSurcursal', md_autenticacion.Auth, productoSucursalController.verProductosPorSucursales);

// Productos por sucursales vista todos
api.get('/productosSucursales', md_autenticacion.Auth, productoSucursalController.ProductosSucursales);

// Enviar productos a sucursales
api.put('/AgregarProductosSurcursales/:idSucursal', md_autenticacion.Auth, productoSucursalController.agregarProductosPorSucursales);

// Venta
api.put('/VentaProductosSucursales/:idSucursal', md_autenticacion.Auth, productoSucursalController.VentaProductoSucursal);


module.exports = api;