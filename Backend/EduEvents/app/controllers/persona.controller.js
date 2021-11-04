const Persona = require("../models/persona.model.js");

// Create y guardar nuevo usuario
exports.crear = (req, res) => {

  // Calidar consulta
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
  }

  // Crear usuario

  const persona = new Persona({
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
        mensaje: err.mensaje || "Ocurrio un error al guardar el usuario en la base de datos.",
        error:err
      });
    else{
      if(data.estado == 'no_permitido'){
        res.send({mensaje:'Ya existe un usuario registrado con ee correo electronico', codigo:406, estado: data.estado, data:null});
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
            mensaje:
              err.message || "Se produjo un error al obtener los usuarios de la base de datos"
          });
        else res.send(data);
      });
};

// Buscar un usuario por correo
exports.obtenerPorCorreo = (req, res) => {

    Persona.buscarPorCorreo(req.params.correo, (err, data) => {
        if (err) {
          if (err.estado === "no_encontrado") {
            res.status(404).send({
              mensaje: `No se encontro el usuario con correo ${req.params.correo}.`, codigo:404, data:null
            });
          } else {
            res.status(500).send({
              mensaje: "Error al obtener el usuario con el correo: " + req.params.correo
            });
          }
        } else res.send({mensaje:"Usuario encontrado", codigo:200, data:data});
      });
  
};

// Actualizar un usuario
exports.actualizar = (req, res) => {
  
};

// Eliminar un usuario
exports.eliminar = (req, res) => {
  
};
