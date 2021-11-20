const Persona = require("../models/persona.model.js");
const ResetToken = require("../models/resetToken.model.js");
const transport = require("../models/enviarCorreo.js");
const configCorreo = require("../config/envemail.config.js");
const { encontrarToken } = require("../models/resetToken.model.js");
var resetToken_datos;

// Create y guardar nuevo usuario
exports.crear = (req, res) => {

  // Validar consulta
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
  }

  // Crear usuario
  const persona = new Persona({
    Id_Evento : req.body.Id_Evento,
    Nombre: req.body.Nombre,
    Apellido: req.body.Apellido,
    Institucion: req.body.Institucion,
    Formacion_Academica: req.body.Formacion_Academica,
    Descripcion: req.body.Descripcion,
    Intereses: req.body.Intereses,
    Fecha_Nacimiento: req.body.Fecha_Nacimiento,
    Fotografia: req.body.Fotografia,
    Correo: req.body.Correo,
    Contrasena: req.body.Contrasena
  });


  // Guardar el usuario en la base de datos
  Persona.crear(persona, (err, data) => {
    if (err)
      res.status(500).send({
        mensaje: err.mensaje || "Ocurrió un error al guardar el usuario en la base de datos.",
        error:err
      });
    else{
      if(data.estado == 'no_permitido'){
        res.send({mensaje:'Ya existe un usuario registrado con el correo electrónico', codigo:406, estado: data.estado, data:null});
        return;
      }else{
        res.send({mensaje:'El usuario fue registrado en la base de datos.', codigo:200, estado: data.estado, data:null})
      }
    }
    
  });

};

// Obtener todos lis usuarios de la base de datos
exports.obtenerPersonas = (req, res) => {
    Persona.obtenerPersonas((err, data) => {
        if (err)
          res.status(500).send({
            mensaje: "Se produjo un error al obtener los usuarios de la base de datos"
          });
        else 
        {
          
          res.send(data);
        }
      });
};

// Buscar un usuario por correo
exports.obtenerPorCorreo = (req, res) => {

    Persona.buscarPorCorreo(req.params.correo, (err, data) => {
        if (err) {
          if (err.estado === "no_encontrado") {
            res.status(404).send({
              mensaje: `No se encontró el usuario con correo ${req.params.correo}.`, codigo:404, data:null
            });
          } else {
            res.status(500).send({
              mensaje: "Error al obtener el usuario con el correo: " + req.params.correo
            });
          }
        } else res.send({mensaje:"Usuario encontrado", codigo:200, data:data});
      });
  
};

//Actualizar toda el perfil de un usuario
exports.actualizarPersona = (req, res) => {

  const personaActualizar = {
    Id : req.body.Id,
    Nombre : req.body.Nombre,
    Apellido : req.body.Apellido,
    Institucion : req.body.Institucion,
    Formacion_Academica : req.body.Formacion_Academica,
    Descripcion : req.body.Descripcion,
    Intereses : req.body.Intereses,
    Fecha_Nacimiento : req.body.Fecha_Nacimiento,
    Fotografia : req.body.Fotografia,
    Correo : req.body.Correo,
  }

  Persona.actualizar(personaActualizar, (err) => {
    if (err) {
      res.send({
        mensaje: `Se produjo un error al actualizar los datos del usuario.`,
        codigo:500
      });

    }
    else {
      res.send({mensaje:"Datos del usuario actualizados", codigo:200, data:null});
    }
   
  });
};

//Actualizar Contraseña
exports.actualizarContra = (req, res) => {
  Persona.actualizarContrasena(req.body, (err) => {
    if (err) {
      res.send({
        mensaje: "Se produjo un error al actualizar la contraseña del usuario",
        codigo:500
      });

    }
    else {
      res.send({mensaje:"Contraseña Actualizada", codigo:200, data:null});
    }
   
  });
};



// Eliminar un usuario



//Enviar correo con el Token
exports.procesoEnviarCorreo = (req, res) => {
  Persona.validar(req.body.Correo, (err,data) => {
    if (err) {
      res.send({
        mensaje: "El correo no se encuentra registrado en la plataforma.",
        codigo:404,
        error:err
      });
      return;
      
    }
    
    if(data.estado == 'ok'){
      res.send({mensaje:"Se ha enviado el correo con el token para reestablecer la contraseña", codigo:200, data:data});
      return;
    }else {
      res.send({
        mensaje: "El correo no se encuentra registrado en la plataforma.",
        codigo: 404,
        data:data
      });
    }
   
  });
};

//validar el Token enviado con el proporcionado por el usuario
exports.procesoValidarToken = (req, res) => {
  Persona.validarToken(req.body, (err,data) => {
    if (err || (data.estado == "no encontrado")) {
      res.send({
        mensaje: "El token no es válido",
        codigo: 500
      });

    }
    else {
      res.send({mensaje:"El token es válido.", codigo:200, data:null});
    }
   
  });
};

//Actualizar la contraseña del usuario
exports.actualizarContra = (req, res) => {
  Persona.cambioContrasena(req.body, (err,data) => {
    if (err) {
      res.send({
        mensaje: "No ha sido posible actualizar la contraseña."
      });

    }
    else {
      res.send({mensaje:"Contrseña actualizada.", codigo:200, data:null});
    }
   
  });
};
  
