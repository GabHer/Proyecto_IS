const Conferencia = require("../models/conferencia.model.js");

exports.crear = (req, res) => {
  // Validar consulta
  if (!req.body) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
  };
  
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

  console.log("La conferencia es: =>>>>>>", conf);
  
  // Guardar el usuario en la base de datos
  Conferencia.crear(conf, (err, data) => {
    if (err){
      res.status(500).send({
        mensaje: err.mensaje || "Ocurrió un error al guardar la conferencia o taller en la base de datos.",
        error:err
      });
      console.log("Error: =>>>>", err);  
    }
    else {
      if(data.estado == 'no_permitido'){
        res.send({mensaje:'Ya existe una conferencia con ese nombre dentro del evento.', codigo:406, estado: data.estado, data:null});
        return;
      } 
      if(data.estado == 'fecha_no_válida'){
        res.send({mensaje:'La fecha ingresada para la conferencia no está dentro del rango de fechas del evento.', codigo:406, estado: data.estado, data:null});
        return;
      } 
      else {
        res.send({mensaje:'La conferencia fue registrada en la base de datos.', codigo:200, estado: data.estado, data:null})
      };
    };
  });
};


// Obtener las conferencias para cada usuario
exports.obtenerConferenciasIdUsuario = (req, res) => {
  if(!req.params) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  };

  Conferencia.obtenerConferenciasPorIdUsuario(req.params.idUsuario, (err, data) => {
    console.log("Se buscan las conferencias para el usuario con id: " + req.params.idUsuario);
    
    if(err) {
      if(err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontraron conferencias para el usuario con id: ${req.params.idUsuario}`, codigo:404, data:null
        });
      }
      else {
        console.log(err);
        res.status(500).send({
          mensaje: "Error al obtener las conferencias para el usuario con id: " + req.params.idUsuario
        });
      };
    } 
    else {
      res.send({
        mensaje: `Se obtuvieron las conferencias para el usuario con id: ${req.params.idUsuario}.`, codigo:200, estado:'ok', data: data
      });
    };
  });
};

// Obtener conferencias 
exports.obtenerConferencias = (req, res) => {
  if(!req.params) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }; 

  Conferencia.obtenerConferencias((err, data) => {
    if(err) {
      res.status(500).send({
        mensaje: err.mensaje || "Ocurrió un error al obtener las conferencias",
        error:err
      });
      return;
    };
    res.send({
      mensaje: 'Se obtuvieron las conferencias de todos los usuarios', codigo:200, estado:'ok', data: data
    });
  });
};

// Obtener las conferencias para cada evento
exports.obtenerConferenciasIdEvento = (req, res) => {
  if(!req.params) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  };

  Conferencia.obtenerConferenciasPorIdEvento(req.params.idEvento, (err, data) => {
    console.log("Se buscan las conferencias para el evento con id: " + req.params.idEvento);
    
    if(err) {
      if(err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontraron conferencias para  el evento con id: ${req.params.idEvento}`, codigo:404, data:null
        });
      }
      else {
        console.log(err);
        res.status(500).send({
          mensaje: "Error al obtener las conferencias para el evento con id: " + req.params.idEvento
        });
      };
    } 
    else {
      res.send({
        mensaje: `Se obtuvieron las conferencias para el evento con id: ${req.params.idEvento}.`, codigo:200, estado:'ok', data: data
      });
    };
  });
};


exports.eliminarConferencia = (req, res) => {
  console.log("Desde el controlador")
  if( !req.params ) {
    res.status(400).send({ mensaje: "No se pudo realizar la operación para eliminar la conferencia, parametros no válidos.", estado:"no_encontrado"});
    return;
  }

  Conferencia.eliminarConferencias( req.params.idConferencia, (err, data) => {

    if(err){
      res.status(500).send( {mensaje: "Ocurrió un error al eliminar la conferencia, la conferencia no fué eliminada.", error:err});
      return;
    }
    res.send({mensaje:"Se eliminó la conferencia.", codigo:200, estado:"ok"});
    return;
  });
  return;
};

// Obtener los participantes inscritos a una conferencia
exports.obtenerParticipantesIdConferencia = (req, res) => {
  if(!req.params) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  };

  Conferencia.obtenerParticipantesPorIdConferencia(req.params.idConferencia, (err, data) => {
    console.log("Se buscan los usuarios inscritos a la conferencia con id: " + req.params.idConferencia);
    
    if(err) {
      if(err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontraron usuarios inscritos a la conferencia con id: ${req.params.idConferencia}`, codigo:404, data:null
        });
      }
      else {
        console.log(err);
        res.status(500).send({
          mensaje: "Error al obtener los usuarios inscritos a la conferencia con id: " + req.params.idConferencia
        });
      };
    } 
    else {
      res.send({
        mensaje: `Se obtuvieron los  usuarios inscritos a la conferencia con id: ${req.params.idConferencia}.`, codigo:200, estado:'ok', data: data
      });
    };
  });
};

