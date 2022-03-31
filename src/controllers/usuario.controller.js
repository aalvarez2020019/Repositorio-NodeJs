const Empresas = require('../models/empresas.model');
const Usuario = require('../models/usuario.model');


const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

// BUSCAR EMPRESAS
function ObtenerEmpresas (req, res) {
    Empresas.find((err, empresasObtenidas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ empresas: empresasObtenidas })
    })
}
function Registrar(req, res) {
  var parametros = req.body;
  var usuarioModel = new Usuario();

  if(parametros.nombre && parametros.apellido && 
      parametros.email && parametros.password) {
          usuarioModel.nombre = parametros.nombre;
          usuarioModel.apellido = parametros.apellido;
          usuarioModel.email = parametros.email;


          Usuario.find({ email : parametros.email }, (err, usuarioEncontrado) => {
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
  Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
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


module.exports = {
    ObtenerEmpresas,
    Registrar,
    Login
}