const Loging = require("../models/loging.model.js");
var jwt = require('jsonwebtoken');
// nuevo loging
exports.iniciarSesion = (req, res) => {

  // Validar consulta
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
  }

  // Crear ojeto Loging

  const loging = new Loging({
    Correo: req.body.Correo,
    Contrasena: req.body.Contrasena
  });

  // Autenticar

  Loging.iniciarSesion(loging, (err, data) => {
    if (err)
      res.status(500).send({
        mensaje: err.mensaje || "Error en el inicio de sesión",
        error:err
      });
    else{
      if(data.estado == 'no_encontrado'){
        res.send({mensaje:'Error, correo o contraseña no son validos', codigo:404, estado: data.estado, data:null});
        return;
      }else{
        // Crear el token

        const token = jwt.sign({
            correo: loging.Correo
        },"miClaveUltraSuperMegaSecreta123", { expiresIn: '14400s' })
        res.send({mensaje:'El usuario se autentico correctamente', codigo:200, estado: data.estado, data:token})
      }
    }
    
  });

};

