const { timingSafeEqual } = require("crypto");
const Evento = require("../models/evento.model");

// Crear y guardar nuevo evento
exports.crear = (req, res) => {
    // Validar consulta
    if(!req.body) {
        res.status(400).send({
            message: "El contenido no puede ser vacio"
        });
        return;
    }

    // Crear evento
    const evento = new Evento({
      Nombre : req.body.Nombre,
      Institucion : req.body.Institucion,
      Descripcion : req.body.Descripcion,
      Fecha_Inicio : req.body.Fecha_Inicio,
      Fecha_Final : req.body.Fecha_Final,
      Estado_Participantes : req.body.Estado_Participantes,
      Estado_Evento : req.body.Estado_Evento, //default inactivo
      Id_Organizador : req.body.Id_Organizador, // tentativo
      Lista_Blanca : req.body.Lista_Blanca,
      Imagenes_Evento : req.body.imagenesEvento,
      Caratula : req.body.Caratula
   
    });


 
    // Guardar el evento en la base de datos
      
    Evento.crear(evento, (err, data) => {
      if(err){
        res.status(500).send({
          mensaje: err.mensaje || "Ocurrió un error al guardar el evento en la base de datos.",
          error:err
        });
        return;
      }
      else{
        if(data.estado == 'no_permitido'){
          res.send({mensaje: 'El evento no se pudo crear porque ya existe un evento con el mismo nombre.', codigo:500, estado:'no_permitido', data: data})
          return;
        }else{
          res.send( {mensaje: 'El evento fue creado', codigo:200, estado:'ok', data: data} )
          return
        }
      }
    });
};

exports.obtenerEventosUsuario = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }

  Evento.obtenerEventosUsuario (req.params.idUsuario, (err, data) => {
    console.log(req.body);
    if(err){
      res.status(500).send({
        mensaje: err.mensaje || "Ocurrió un error al obtener los eventos.",
        error:err
      });
      return;
    }

    else {
      res.send( {mensaje: 'Se obtuvieron los eventos de este usuario', codigo:200, estado:'ok', data: data});
    };
  })
}

exports.obtenerEventos = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  } 

  Evento.obtenerEventos ((err, data) => {

    if(err){
      res.status(500).send({
        mensaje: err.mensaje || "Ocurrió un error al obtener los eventos.",
        error:err
      });
      return;
    }

    else {
      res.send( {mensaje: 'Se obtuvieron los eventos de todos los usuarios', codigo:200, estado:'ok', data: data});
    };
  })
}




exports.obtenerEventoId = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }

  Evento.obtenerEventoPorId(req.params.idEvento, (err, data) => {
    
    if (err) {
      if (err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontró un evento con el id ${req.params.idEvento}`, codigo:404, data:null
        });
      } else {
        console.log(err);
        res.status(500).send({
          mensaje: "Error al obtener el evento con el id: " + req.params.idEvento
        });
      };

    } else {
      console.log("El evento a enviar >>>>>> " , data[0])
      res.send( {mensaje: `Se obtuvó el evento con el id ${req.params.idEvento}.`, codigo:200, estado:'ok', data: data[0]} );

    };

  });
};



exports.obtenerEventosFecha = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }

  Evento.obtenerEventosPorFecha(req.params, (err, data) => {
    console.log("Se buscan eventos cuyas fechas de inicio y/o fechas de fin estan entre: " + req.params.fechaInicio + " - " + req.params.fechaFinal);
    
    if (err) {
      if (err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontraron eventos cuyas fechas de inicio y/o fechas de fin estan entre: ${req.params.fechaInicio}  -  ${req.params.fechaFinal}`, codigo:404, data:null
        });
      } else {
        console.log(err);
        res.status(500).send({
          mensaje: "Error al intentar obtener eventos cuyas fechas de inicio y/o fechas de fin estan entre: " + req.params.fechaInicio + "-" + req.params.fechaFinal
        });
      };

    } else {
      res.send( {mensaje: ` Se encontraron eventos cuyas fechas de inicio y/o fechas de fin estan entre: ${req.params.fechaInicio}  -  ${req.params.fechaFinal}`, codigo:200, estado:'ok', data: data} );

    };

  });
};


exports.obtenerEventosFechaOrganizador = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }

  Evento.obtenerEventosPorFechaYOrganizador(req.params, (err, data) => {
    console.log("Se buscan eventos del usuario: " + req.params.idOrganizador + " cuyas fechas de inicio y/o fechas de fin estan entre: " + req.params.fechaInicio + " - " + req.params.fechaFinal);
    
    if (err) {
      if (err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontraron eventos del usuario: ${req.params.idOrganizador} cuyas fechas de inicio y/o fechas de fin estan entre: ${req.params.fechaInicio}  -  ${req.params.fechaFinal}`, codigo:404, data:null
        });
      } else {
        console.log(err);
        res.status(500).send({
          mensaje: "Error al intentar obtener eventos para el usuario: " + req.params.idOrganizador + " cuyas fechas de inicio y/o fechas de fin estan entre: " + req.params.fechaInicio + " - " + req.params.fechaFinal
        });
      };

    } else {
      res.send( {mensaje: ` Se encontraron eventos del usuario: ${req.params.idOrganizador} cuyas fechas de inicio y/o fechas de fin estan entre: ${req.params.fechaInicio}  -  ${req.params.fechaFinal}`, codigo:200, estado:'ok', data: data} );

    };

  });
};



exports.obtenerEvPorEstado = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }

  Evento.obtenerEventosEstado(req.params.estado, (err, data) => {
    console.log("El estado que se busca: " , req.params.estado);
    
    if (err) {
      if (err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontraron eventos que esten en estado ${req.params.estado}.`, codigo:404, data:null
        });
      } else {
        res.status(500).send({
          mensaje: "Error al obtener eventos en el estado: " + req.params.estado
        });
      };

    } else {
      res.send( {mensaje: `Se obtuvieron los eventos que estan en el estado ${req.params.estado}.`, codigo:200, estado:'ok', data: data} );

    };

  });
};




exports.obtenerEvPorEstadoUsuario = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }

  Evento.obtenerEventosEstadoIdUsuario(req.params, (err, data) => {
    console.log("El estado que se busca: " , req.params.estado) ," para el usuario: ", req.params.idUsuario;
    
    if (err) {
      if (err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontraron eventos que esten en estado ${req.params.estado} para el usuario con id: ${req.params.idUsuario}`, codigo:404, data:null
        });
      } else {
        console.log(err);
        res.status(500).send({
          mensaje: "Error al obtener eventos en el estado: " + req.params.estado + " para el usuario con id " + req.params.idUsuario
        });
      };

    } else {
      res.send( {mensaje: `Se obtuvieron los eventos que estan en el estado ${req.params.estado} para el usuario con id ${req.params.idUsuario}.`, codigo:200, estado:'ok', data: data} );

    };

  });
};



exports.obtenerImagenes = (req, res) => {
  if( !req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  }

  Evento.obtenerImagenesEvento(req.params.idEvento, (err, data) => {
    console.log("Se buscan las imágenes del evento con id: " + req.params.idEvento);
    
    if (err) {  
        console.log(err);
        res.status(500).send({
          mensaje: "Error al obtener las imágenes del evento con id:" + req-params.idEvento
        });
      }

      else {
      res.send( {mensaje: `Se obtuvieron las imágenes del evento con id: ${req.params.idEvento}`, codigo:200, estado:'ok', data: data} );

    };

  });
};





exports.eliminarEvento = (req, res) => {
  console.log("Desde el controlador")
  if( !req.params ) {
    res.status(400).send({ mensaje: "No se pudo realizar la operación para eliminar evento, parametros no válidos.", estado:"no_encontrado"});
    return;
  }

  Evento.eliminarEvento( req.params.idEvento, (err, data) => {

    if(err){
      res.status(500).send( {mensaje: "Ocurrió un error al eliminar el evento, el evento no fue eliminado.", error:err});
      return;
    }
    res.send({mensaje:"Se eliminó el evento", codigo:200, estado:"ok", data:data} );
    return;
  });
  return;
};



