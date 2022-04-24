var Producto = require('../models/productos.model');
var fs = require('fs');
var path = require('path');

// OBTENER PRODUCTOS
function obtenerProductos(req, res) {

    Producto.find({ empresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {
  
      return res.status(200).send({ Sucursales: sucursalEmpresaEncontrada })
    })
  
  }

// AGREGAR PRODUCTOS
function agregarProductos(req, res) {

    if (req.user.rol !== "ROL_EMPRESA") {
        return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
    }

    var empresaID = req.user.sub;
    var params = req.body;


    if (req.user.rol === 'ROL_EMPRESA') {

        if (params.nombre) {
            var productoModel = new Producto();
            productoModel.nombre = params.nombre;
            productoModel.nombreProveedor = params.nombreProveedor;
            productoModel.stock = params.stock;
            productoModel.cantidadVendida = 0;
            productoModel.empresa = empresaID;

            Producto.find({
                nombre: params.nombre,
                empresa: req.user.sub
            }).exec((err, productoNoEncontrado) => {
                if (err) return console.log({ mensaje: 'Error en la peticion' });
                if (productoNoEncontrado.length >= 1) {
                    return res.status(500).send({ mensaje: "Este producto ya existe" });
                } else {
                    productoModel.save((err, productoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (productoGuardado) {
                            res.status(220).send({ productoGuardado }); //.send({mensaje: 'Producto guardado'});

                        } else {
                            res.status(500).send({ mensaje: 'Error al registrar producto' });
                        }
                    });
                }

            });
        } else {
            if (err) return res.status(500).send({ mensaje: 'No puede dejar espacios vacios' });
        }

    } else {
        return res.status(500).send({ mensaje: 'Solo la empresa puede registrar empleados' });
    }
}

// EDITAR PRODUCTOS
function editarProductos(req, res) {
    var idProducto = req.params.idProducto;
  
    var datos = req.body;

    Producto.findByIdAndUpdate({ _id: idProducto }, datos, { new: true }, (error, productoEditado) => {

        if (error) return res.status(500).send({ Error: "Error en la peticion." });

        return res.status(200).send({ PRODUCTOS: productoEditado });
      }
    );
  }




module.exports = {
    agregarProductos,
    obtenerProductos,
    editarProductos,
}