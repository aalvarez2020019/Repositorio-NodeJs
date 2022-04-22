/* CONTROLADOR SUCURSALES */
const Sucursales = require('../models/sucursales.model');

// Agregar Sucursales
function AgregarSucursales(req, res) {
    var parametros = req.body;
    var sucursalModel = new Sucursales();

    if (req.user.rol !== "ROL_EMPRESA") {
        return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
    }
  
    if (parametros.nombreSucursal && parametros.direccionSucursal) {

      sucursalModel.nombreSucursal = parametros.nombreSucursal;
      sucursalModel.direccionSucursal = parametros.direccionSucursal;
      sucursalModel.idEmpresa = req.user.sub;
  
      sucursalModel.save((error, crearSucursales) => {

        if (error) return res.status(500).send({ error: "Error al momento de crear la sucursal" });

        if (!crearSucursales) return res.status(500).send({ error: "No se puede agregar la sucursal" });

        return res.status(200).send({ SUCURSALES: crearSucursales }
            );
      }
      );

      }
  }
 
// Editar Sucursales
function editarSucursal(req, res) {
    var idSuc = req.params.idSucursal;
    var parametros = req.body;
  
    if (req.user.rol !== "ROL_EMPRESA") {
        return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
    }

    if (parametros.nombreSucursal || parametros.direccionSucursal) {

      Sucursales.findOneAndUpdate({ _id: idSuc, idEmpresa: req.user.sub }, parametros,{ new: true },(error, sucursalModificada) => {

          if (error) return res.status(500).send({ error: "Error al momento de modificar"});
          if (!sucursalModificada) return res.status(500).send({ error: "No existe la sucursal" });
          return res.status(200).send({ SUCURSALES: sucursalModificada }
            );
        }
      );
    } 
  }

// Eliminar Sucursales
function EliminarSucursales(req, res) {
    
    if (req.user.rol !== "ROL_EMPRESA") {
        return res.status(500).send({ mensaje: "Solo la empresa tiene permisos" });
    }

    var idSucursal = req.params.idSucursal;
  
    Sucursales.findByIdAndDelete({ _id: idSucursal, idEmpresa: req.user.sub }, (error, sucursalEliminada) => {
        if (error) return res.status(500).send({ Error: "Error al querer eliminar la sucursal" });
        if (!sucursalEliminada)
          return res.status(500).send({ Error: "No existe la sucursal" });

        return res.status(200).send({ SUCURSALES: sucursalEliminada }
            );
      }
    );
}

// BUSCAR SUCURSALES
function ObtenerSucursales (req, res) {
    Sucursales.find((err, sucursalesObtenidas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ sucursales: sucursalesObtenidas })
    })
}

// BUSCAR SUCURSALES POR ID
function ObtenerSucursalesId(req, res) {
    var idEmpr = req.params.idSucursal;
 
    Sucursales.findById(idEmpr, (err, sucursalesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!sucursalesEncontradas) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ sucursal: sucursalesEncontradas });
    })
}

module.exports={
 
    ObtenerSucursales,
    ObtenerSucursalesId,
    AgregarSucursales,
    editarSucursal,
    EliminarSucursales,
}