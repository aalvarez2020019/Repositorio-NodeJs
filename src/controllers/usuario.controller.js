const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function Registrar(req, res) {
  var parametros = req.body;
  var usuarioModel = new Usuarios();

  if(parametros.nombre && parametros.apellido && 
      parametros.email && parametros.password) {
          usuarioModel.nombre = parametros.nombre;
          usuarioModel.apellido = parametros.apellido;
          usuarioModel.email = parametros.email;


          Usuarios.find({ email : parametros.email }, (err, usuarioEncontrado) => {
              if ( usuarioEncontrado.length == 0 ) {

                  bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                      usuarioModel.password = passwordEncriptada;

                      usuarioModel.save((err, usuarioGuardado) => {
                          if (err) return res.status(500)
                              .send({ mensaje: 'Error en la peticion' });
                          if(!usuarioGuardado) return res.status(500)
                              .send({ mensaje: 'Error al agregar el Usuario'});
                          
                          return res.status(200).send({ usuario: usuarioGuardado });
                      });
                  });                    
              } else {
                  return res.status(500)
                      .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
              }
          })
  }
}

function Login(req, res) {
  var parametros = req.body;
  Usuarios.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
      if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
      if(usuarioEncontrado){
          // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
          bcrypt.compare(parametros.password, usuarioEncontrado.password, 
              (err, verificacionPassword)=>{//TRUE OR FALSE
                  // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                  if ( verificacionPassword ) {
                      // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                      if(parametros.obtenerToken === 'true'){
                          return res.status(200)
                              .send({ token: jwt.crearToken(usuarioEncontrado) })
                      } else {
                          usuarioEncontrado.password = undefined;
                          return  res.status(200)
                              .send({ usuario: usuarioEncontrado })
                      }

                      
                  } else {
                      return res.status(500)
                          .send({ mensaje: 'Las contrasena no coincide'});
                  }
              })

      } else {
          return res.status(500)
              .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
      }
  })
}

function AgregarUsuario(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuarios();

    if (parametros.nombre && parametros.apellido &&
        parametros.email && parametros.password) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;

        Usuarios.find({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al momento de agregar al cliente' });

                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                });

            } else {
                return res.status(500).send({ mensaje: 'Verifique el correo, ya se encuentra utilizado' });
            }
        })
    }
}


function editarUsuarios(req, res) {

    // NO PUEDE EDITAR EL CLIENTE

    //if (req.user.rol == "ROL_CLIENTE") return res.status(500).send({ mensaje: 'Este rol no tiene acceso' });

    var idUser = req.params.idUsuario;
    var parametros = req.body;

    Usuarios.findOne({ _id: idUser }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "No existe el usuario" });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "No existe el usuario" })

        //if (usuarioEncontrado.rol == 'ROL_CLIENTE') {

        Usuarios.findByIdAndUpdate(idUser, parametros, { new: true },
                (err, usuarioActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al momento de editar' });

                    return res.status(200).send({ usuario: usuarioActualizado })
                })
            //} else {
        return res.status(500).send({ mensaje: "No se pudo editar" });

    });
}

function eliminarUsuarios(req, res) {

    // NO PUEDE ELIMINAR CLIENTE
    //if (req.user.rol == "ROL_CLIENTE") return res.status(500).send({ mensaje: 'Este rol no tiene acceso' });

    var idUser = req.params.idUsuario;

    Usuarios.findOne({ _id: idUser }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "No existe el usuario" });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: "No existe el usuario" })
            //if (usuarioEncontrado.rol == "ROL_CLIENTE") {

        Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                if (err) return res.status(500).send({ mensaje: "Error, el usuario no existe" });
                if (!usuarioEliminado) return res.status(404).send({ mensaje: "Error, el usuario no existe" })
                return res.status(200).send({ usuario: usuarioEliminado });

            })
            //} else {

        return res.status(500).send({ mensaje: 'No cuentas con los permisos para editar' });

    });
}




module.exports = {
    AgregarUsuario,
    editarUsuarios,
    eliminarUsuarios,
    Registrar,
    Login
}