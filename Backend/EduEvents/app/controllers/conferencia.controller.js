const Conferencia = require("../models/conferencia.model.js");

exports.crear = (req, res) => {

    // Validar consulta
    if (!req.body) {
      res.status(400).send({
        message: "El contenido no puede ser vacio"
      });
    }
  
    // Crear usuario
    const conf = new Conferencia({
        Id_Evento: req.body.Id_Evento,
        Tipo : req.body.Tipo, 
        Nombre: req.body.Nombre,
        Descripcion: req.body.Descripcion,
        Modalidad: req.body.Modalidad,
        Medio: req.body.Medio,
        Correo_Encargado: req.body.Correo_Encargado,
        Fecha_Inicio: req.body.Fecha_Inicio,
        Hora_Inicio: req.body.Hora_Inicio,
        Hora_Final: req.body.Hora_Final,
        Imagen : req.body.Imagen,
        Limite_Participantes: req.body.Limite_Participantes
    });
  
  
    // Guardar el usuario en la base de datos
    Conferencia.crear(conf, (err, data) => {
      if (err)
        res.status(500).send({
          mensaje: err.mensaje || "Ocurrió un error al guardar la conferencia o taller en la base de datos.",
          error:err
        });
      else{
        if(data.estado == 'no_permitido'){
          res.send({mensaje:'Ya existe una conferencia con ese nombre dentro del evento.', codigo:406, estado: data.estado, data:null});
          return;
        }else{
        
          res.send({mensaje:'La conferencia fue registrada en la base de datos.', codigo:200, estado: data.estado, data:null})
        }
      }
      
    });
  
  };