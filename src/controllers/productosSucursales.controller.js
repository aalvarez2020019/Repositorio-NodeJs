// MODELO DE PRODUCTOS POR SUCURSALES
var ProductosEmpresas = require('../models/productos.model');
var Sucursales = require('../models/sucursales.model');
var ProductoPorSucursal = require('../models/productosSucursales.model');

// Ver productos por sucursales id
function verProductosPorSucursales(req, res) {

    if (req.user.rol !== "ROL_EMPRESA") {
        return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
    }

    var idSucursal = req.params.idSucursal;

    ProductoPorSucursal.find({idSucursal: idSucursal , idEmpresa: req.user.sub }, (err, productoEncontrado) => {

        if (err) return res.status(404).send({ mensaje: "No se encuentran los productos" });

          if(!productoEncontrado) return res.status(404).send({ mensaje: "Productos no encontrados"})

        return res.status(200).send({ PRODUCTOS: productoEncontrado });
      }
    )
  }




// Ordenar por stock mayor por el id
function StockSucursalMayor(req, res) {

  if (req.user.rol !== "ROL_EMPRESA") {
    return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
  }

  const idSucur = req.params.idSucursal

  ProductoPorSucursal.find( { idSucursal: idSucur, idEmpresa: req.user.sub }, (err, productoEncontrado) => {

      if (err)return res.status(404).send({ mensaje: "No se encontro el producto" });

      return res.status(200).send({ PRODUCTOS: productoEncontrado });
    }

  ).sort({StockSucursal: -1})

}

// Ordenar por stock menor por el id
function StockSucursalMenor(req, res) {

  if (req.user.rol !== "ROL_EMPRESA") {
    return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
  } 

  const idSucur = req.params.idSucursal

  ProductoPorSucursal.find({ idSucursal: idSucur, idEmpresa: req.user.sub }, (err, productoEncontrado) => {

      if (err)return res.status(404).send({ mensaje: "No se encontro el producto" });
      return res.status(200).send({ PRODUCTOS: productoEncontrado });
    }
  ).sort({StockSucursal: 1})

}

// Productos más vendido
function ProductoMasVendido(req, res) {

  if (req.user.rol !== "ROL_EMPRESA") {
    return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
  }

  const idSucur = req.params.idSucursal;

  ProductoPorSucursal.find({idSucursal: idSucur, idEmpresa: req.user.sub }, (err, productoEncontrado) => {

      if (err) return res.status(404).send({ mensaje: "No se encontro el producto" });

      return res.status(200).send({ PRODUCTOS: productoEncontrado });
    }

  ).sort({CantidadVendida: -1})

}



// Enviar productos a las sucursales
function agregarProductosPorSucursales(req, res) {

    if (req.user.rol !== "ROL_EMPRESA") {
        return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
    }

    const parametrosProductosSucursales = new ProductoPorSucursal();
    const parametros = req.body;
    const idSucursal = req.params.idSucursal;
  
  
    if ( parametros.NombreProductoSucursal && parametros.StockSucursal  ) {
  
      Sucursales.findOne({ _id: idSucursal, idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {

        if (!sucursalEmpresaEncontrada) return res.status(404).send({ mensaje: "NO SE ENCONTRO LA SUCURSAL" });
        if (err) return res.status(404).send({ mensaje: "NO SE ENCONTRO LA SUCURSAL" });
  
        // Producto por empresas
        ProductosEmpresas.findOne({ nombreProducto: parametros.NombreProductoSucursal, idEmpresa: req.user.sub }, (err, productoEncontrado) => {

          if (!productoEncontrado) return res.status(404).send({ mensaje: "No se encontro el producto por empresas" });
          if (err) return res.status(404).send({ mensaje: "No se encuentra el producto" });
  
  
          // Producto por sucursales
          ProductoPorSucursal.findOne({ NombreProductoSucursal: parametros.NombreProductoSucursal, idSucursal: sucursalEmpresaEncontrada.id }, (err, productoPorSucursalUbicado) => {
            if (err) return res.status(404).send({ mensaje: "no se encontro el producto por sucursales" });
  
            if (parametros.StockSucursal <= 0) {
              return res.status(404).send({ mensaje: "No se acepta el formato, es incorrecto" });
            }
  
            if (parametros.StockSucursal > productoEncontrado.Stock) {
              return res.status(404).send({ mensaje: "No hay una cantidad o stock" });
            }
  
            // Stock de los productos por empresas
            const data = {

              Stock: productoEncontrado.Stock,
            }

            data.Stock = productoEncontrado.Stock - parametros.StockSucursal
  
            if (productoPorSucursalUbicado == null) {
  
                parametrosProductosSucursales.idSucursal = sucursalEmpresaEncontrada.id;
                parametrosProductosSucursales.NombreProductoSucursal = parametros.NombreProductoSucursal
                parametrosProductosSucursales.StockSucursal = parametros.StockSucursal
                parametrosProductosSucursales.CantidadVendida = 0
  
                parametrosProductosSucursales.save((err, SucursalesGuardadas) => {

                ProductosEmpresas.findOneAndUpdate({ _id: productoEncontrado.id }, data, { new: true }, (err, GuardarStockEmpresa) => {
                })

                // Guardar la sucursal
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                if (!SucursalesGuardadas) return res.status(500).send({ mensaje: "No se puede agregar la sucursal" });

                return res.status(200).send({ SUCURSAL: SucursalesGuardadas });

              });
              
            } else {
  
                ProductoPorSucursal.findByIdAndUpdate({ _id: productoPorSucursalUbicado.id }, { $inc: { StockSucursal: parametros.StockSucursal } }, { new: true }, (err, CantidadModificada) => {
                  
                ProductosEmpresas.findOneAndUpdate({ _id: productoEncontrado.id }, data, { new: true }, (err, ActualizarStockEmpresa) => {
                    
                })

                // Producto stock

                if (!CantidadModificada) return res.status(404).send({ mensaje: "No se encuentra el producto" });

                if (err) return res.status(404).send({ mensaje: "No se encuentra el producto" });
  
                return res.status(404).send({ PRODUCTOS_SUCURSALES: CantidadModificada });

              })
            }
          }
          )
        }
        );
      }
      )
  
    } 
  
  }

  // Vender productos por sucursales
  function VentaProductoSucursal(req, res) {

    if (req.user.rol !== "ROL_EMPRESA") {
        return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
    }


  const parametros = req.body;
  const idSucur = req.params.idSucursal

  if (
    parametros.ProductoSucursal && parametros.StockVenta

  ) {

    Sucursales.findOne({ _id: idSucur, idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {

      if (!sucursalEmpresaEncontrada) return res.status(404).send({ mensaje: "No se encuentra la sucursal, intentelo de nuevo" });
      if (err) return res.status(404).send({ mensaje: "No se encuentra la sucursal, intentelo de nuevo" });

      ProductoPorSucursal.findOne({ NombreProductoSucursal: parametros.ProductoSucursal, idSucursal: sucursalEmpresaEncontrada.id }, (err, EncontrarProductoSucursal) => {

        // Reglas del stock

        if (err) return res.status(404).send({ mensaje: "En este producto no se encuentran sucursales" });

        if (parametros.StockVenta <= 0) {
          return res.status(404).send({ mensaje: "Al parecer este tipo de formato es incorrecto" });
        }

        if (parametros.StockVenta > EncontrarProductoSucursal.StockSucursal) {

          return res.status(404).send({ mensaje: "No hay stock, intentelo de nuevo" });
        }

        const data = {

        StockSucursal: EncontrarProductoSucursal.StockSucursal, CantidadVendida: EncontrarProductoSucursal.CantidadVendida

        }

        data.StockSucursal = EncontrarProductoSucursal.StockSucursal - parametros.StockVenta
        
        data.CantidadVendida = parseFloat(data.CantidadVendida)  + parseFloat(parametros.StockVenta) 

        if (EncontrarProductoSucursal == null) {

          return res.status(404).send({ mensaje: "No se encuentra el producto en sucursales" });

        } else {

            ProductoPorSucursal.findByIdAndUpdate({ _id: EncontrarProductoSucursal.id }, data, { new: true }, (err, ModificarStock) => {

            if (!ModificarStock) return res.status(404).send({ mensaje: "No se encontro el producto" });

            if (err) return res.status(404).send({ mensaje: "No se encontro el producto" });

            return res.status(404).send({ PRODUCTOS_SUCURSALES: ModificarStock });

          })
        }
      })

    })

  } 

}





  module.exports = {
      
    agregarProductosPorSucursales,
    VentaProductoSucursal,
    verProductosPorSucursales,
    StockSucursalMayor,
    StockSucursalMenor,
    ProductoMasVendido,

  }


