const Sucursales = require('../models/sucursales.model');

// AGREGAR SUCURSALES
function AgregarSucursales (req, res){

    var parametros = req.body;
    var sucursalesModelo = new Sucursales();

    if( parametros.nombreSucursal && parametros.direccionSucursal) {
        sucursalesModelo.nombreSucursal = parametros.nombreSucursal;
        sucursalesModelo.direccionSucursal = parametros.direccionSucursal;

        sucursalesModelo.save((err, sucursalGuardada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!sucursalGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ninguna sucursal"});

            return res.status(200).send({ sucursal: sucursalGuardada });
        })
    }
}

// EDITAR SUCURSALES
function EditarSucursales (req, res) {
    var idEmpr = req.params.idSucursal;
    var parametros = req.body;

    Sucursales.findByIdAndUpdate(idEmpr, parametros, { new: true } ,(err, sucursalesActualizadas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!sucursalesActualizadas) return res.status(404).send( { mensaje: 'Error al Editar la sucursal'});

        return res.status(200).send({ sucursales: sucursalesActualizadas});
    });
}

// ELIMINAR SUCURSALES
function EliminarSucursales(req, res) {
    var idEmpr = req.params.idSucursal;

    Sucursales.findByIdAndDelete(idEmpr, (err, sucursalEliminada) => {

        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!sucursalEliminada) return res.status(404).send( { mensaje: 'Error al eliminar la sucursal'});

        return res.status(200).send({ sucursales: sucursalEliminada});
    })
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
    AgregarSucursales,
    EditarSucursales,
    EliminarSucursales,
    ObtenerSucursales,
    ObtenerSucursalesId
}