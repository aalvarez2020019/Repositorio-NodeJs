const Empresas = require('../models/empresas.model');

// BUSCAR EMPRESAS
function ObtenerEmpresas (req, res) {
    Empresas.find((err, empresasObtenidas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ empresas: empresasObtenidas })
    })
}

// BUSCAR EMPRESAS POR ID
function ObtenerEmpresasId(req, res) {
    var idEmpr = req.params.idEmpresa;
 
    Empresas.findById(idEmpr, (err, empresasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!empresasEncontradas) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ empresa: empresasEncontradas });
    })
}

// AGREGAR EMPRESAS
function AgregarEmpresas (req, res){
    var parametros = req.body;
    var empresasModelo = new Empresas();

    if( parametros.empresa && parametros.actividades) {

        empresasModelo.empresa = parametros.empresa;
        empresasModelo.actividades = parametros.actividades;

        empresasModelo.save((err, empresaGuardada) => {

            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!empresaGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ninguna empresa"});

            return res.status(200).send({ empresa: empresaGuardada });
        })
    }
}

// EDITAR EMPRESAS
function EditarEmpresas (req, res) {
    var idEmpr = req.params.idEmpresa;
    var parametros = req.body;

    Empresas.findByIdAndUpdate(idEmpr, parametros, { new: true } ,(err, empresasActualizadas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresasActualizadas) return res.status(404).send( { mensaje: 'Error al Editar la empresa'});

        return res.status(200).send({ empresas: empresasActualizadas});
    });
}

// ELIMINAR EMPRESAS
function EliminarEmpresas(req, res) {
    var idEmpr = req.params.idEmpresa;

    Empresas.findByIdAndDelete(idEmpr, (err, empresaEliminada) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresaEliminada) return res.status(404).send( { mensaje: 'Error al eliminar la empresa'});

        return res.status(200).send({ empresa: empresaEliminada});
    })
}

module.exports = {
    AgregarEmpresas,
    ObtenerEmpresas,
    EditarEmpresas,
    EliminarEmpresas,
    ObtenerEmpresasId
}