const Login = require("../models/login.model.js");
var jwt = require('jsonwebtoken');
// nuevo login
exports.iniciarSesion = (req, res) => {


  // Validar consulta
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
  }

  // Crear ojeto Login

  const login = new Login({
    Correo: req.body.Correo,
    Contrasena: req.body.Contrasena
  });

  // Autenticar

  Login.iniciarSesion(login, (err, data) => {
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
            correo: login.Correo
        },"miClaveUltraSuperMegaSecreta123", { expiresIn: '14400s' })
        res.send({mensaje:'El usuario se autentico correctamente', codigo:200, estado: data.estado, data:{token:token, correo:login.Correo}})
      }
    }
    
  });

};

