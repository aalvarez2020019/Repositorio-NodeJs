var Producto = require('../models/productos.model');
var fs = require('fs');
var path = require('path');


function agregarProductos(req, res) {
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

function obtenerProductos(req, res) {

    Producto.find({ empresa: req.user.sub }, (err, productoEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion' });
        if (!productoEncontrados) return res.status(500).send({ mensaje: 'Aun no hay productos' });

        return res.status(200).send({ productoEncontrados });
    });

}


module.exports = {
    agregarProductos,
    obtenerProductos,
}