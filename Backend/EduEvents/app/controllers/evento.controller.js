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

// Obtener todos los eventos de la base de datos
exports.obtenerEventos = (req, res) => {
  evento.obtenerEventos((err, data) => {
    if(err){
      res.status(500).send({
        mensaje: "Se produjo un error al obtener los eventos de la base de datos"
      });
    }
    else{
      res.send(data);
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

    res.send( {mensaje: 'Se obtuvieron los eventos de este usuario', codigo:200, estado:'ok', data: data} )

  })

}

/*
// Obtener todos los eventos de la base de datos
exports.obtenerEventos = (req, res) => {
  evento.obtenerEventos((err, data) => {
    if(err){
      res.status(500).send({
        mensaje: "Se produjo un error al obtener los eventos de la base de datos"
      });
    }
    else{
      res.send(data);
    }
  });
};

// Buscar un evento por Nombre
exports.obtenerPorNombre = (req, res) => {
  evento.buscarPorNombreEvento(req.params.nombre, (err, data) => {
    if(err) {
      if(err.estado === "no_encontrado"){
        res.status(404).send({
          mensaje: `No se encontró el evento con nombre ${req.params.nombre}.`, codigo:404, data:null
        });
      } 
      else{
        res.status(500).send({
          mensaje: "Error al obtener el evento con nombre: " + req.params.nombre
        });
      }
    } 
    else{
      res.send({
        mensaje:"evento encontrado", codigo:200, data:data
      });
    }   
  }); 
};


*/


