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

  
//Editar PRODUCTOS
  function EditarProducto(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    if (req.user.rol != 'Empresa')
        return res.status(500).send({ mensaje: 'Solo las empresas pueden acceder a esta función' });

    Producto.find({ nombreProducto: parametros.nombreProducto }, (err, productoEncontrado) => {
        if (productoEncontrado.length == 0) {

            Producto.findOneAndUpdate({ _id: idProd, idEmpresa:req.user.sub }, parametros, { new: true }, (err, productoActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!productoActualizado) return res.status(500).send({ mensaje: 'Ocurrio un error o no tiene permitido modificar el producto de esta empresa' });

                return res.status(200).send({ producto: productoActualizado })
            })

        } else {
            parametros.nombreProducto=productoEncontrado.nombreProducto;
            Producto.findOneAndUpdate({ _id: idProd, idEmpresa: req.user.sub }, parametros, { new: true }, (err, productoActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!productoActualizado) return res.status(500).send({ mensaje: 'Ocurrio un error o no tiene permitido modificar el producto de esta empresa' });

                return res.status(200).send({ producto: productoActualizado })
            })
        }
    })

}
//STOCK 
function StockProducto(req, res) {
    var productoId = req.params.idProducto;
    var parametros = req.body;

    if (req.user.rol == 'Admin')
        return res.status(404).send({ mensaje: 'El administrador no puede eliminar las sucursales de las empresas' });

    if (parametros.stock < 0) {
        var CantidadNegativa = parametros.stock * -1;

        Producto.findById(productoId, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Ocurrio un error' });
            if (productoEncontrado.stock < CantidadNegativa)
                return res.status(500).send({ mensaje: 'No hay sufiente stock como para eliminar esa cantidad' })

            ultimaCantidad = CantidadNegativa * -1;
            Producto.findOneAndUpdate({ _id: productoId, idEmpresa: req.user.sub }, { $inc: { stock: ultimaCantidad } }, { new: true }, (err, productoModificado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!productoModificado) return res.status(500).send({ mensaje: "Ocurrio un error o intento editar la cantidad de un producto que no le pertenece" });

                return res.status(200).send({ producto: productoModificado })
            })
        })
    } else {
        Producto.findOneAndUpdate({ _id: productoId, idEmpresa: req.user.sub }, { $inc: { stock: parametros.stock } }, { new: true }, (err, productoModificado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productoModificado) return res.status(500).send({ mensaje: "Ocurrio un error o intento editar la cantidad de un producto que no le pertenece" });

            return res.status(200).send({ producto: productoModificado })
        })
    }
}


//eLIMINAR PRODUCTOS
function EliminarProducto(req, res) {
    var idProd = req.params.idProducto;

    if (req.user.rol == 'Admin')
        return res.status(404).send({ mensaje: 'El administrador no puede eliminar las sucursales de las empresas' });

    Producto.findOneAndDelete({ _id: idProd, idEmpresa: req.user.sub }, (err, productoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEliminado) return res.status(404).send({ mensaje: 'Ocurrio un error o intento eliminar una producto que no le pertenece' });

        return res.status(200).send({ producto: productoEliminado });
    })
}

module.exports = {
    agregarProductos,
    obtenerProductos,
    editarProductos,
    EditarProducto,
    EliminarProducto,
    StockProducto

}