const Asistencia = require("../models/asistencia.model");

// Actualizar el campo asistencia para todas las personas incritas a una conferencia.
exports.actualizarAsistencia = (req, res) => {
    if(!req.body) {
      res.status(400).send({
        message: "El contenido no puede ser vacío"
      });
      return;
    };
  
    Asistencia.actualizar(req.body, (err, data) => {
    
    if(err) {
        console.log(err);
        res.status(500).send({
        mensaje: "Error al actualizar el campo de 'Asistencia' para los inscritos en la conferencia con Id: " + req.body.idConferencia
      });
    } 
    else {
      res.status(200).send({
        mensaje: `Se actualizó el campo de 'Asistencia' para los inscritos en la conferencia con Id: ${req.body.idConferencia}.`, codigo:200, estado:'ok'
      });
    };
  });
};

// Obtener datos para renderizar diplomas
exports.obtenerDatosDiploma = (req, res) => {
  if(!req.params) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  };

  Asistencia.obtenerDatosDiploma(req.params, (err, data) => {
    console.log(`Se desea obtener el diploma del usuario con id: ${req.params.idPersona} como participante en la conferencia con id: ${req.params.idConferencia}`);
  
    if(err) {
      if(err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontró el diploma del usuario con id: ${req.params.idPersona} como participante en la conferencia con id: ${req.params.idConferencia}`, codigo:404, data:null
        });
    }
    else {
      console.log(err);
      res.status(500).send({
        mensaje: `Error al obtener el diploma del usuario con id: ${req.params.idPersona} como participante en la conferencia con id: ${req.params.idConferencia}`
      });
    };
  } 
  else {
    res.send({
      mensaje: `Se obtuvo el diploma del usuario con id: ${req.params.idPersona} como participante en la conferencia con id: ${req.params.idConferencia}`, codigo:200, estado:'ok', data:data
    });
  };
});
};



exports.asistenciaEmision = (req, res) => {
    if(!req.params) {
        res.status(400).send({
        message: "El contenido no puede ser vacío"
        });
        return;
    };

    Asistencia.emision(req.params, (err, data) => {

        if(err) {
            console.log(err);
            res.status(500).send({
            mensaje: "Error al obtener si se ha emitido la asitencia o no, para la conferencia con id : " + req.params.idConferencia
            });
        } 

        if (data.estado == "no_encontrado") {
            res.status(404).send({
                mensaje: `El id de Conferencia no exite.`, codigo:404, data:null
            });
         }

        else {

            res.status(200).send({
                mensaje: `Se ha obtenido si se ha emitido la lista de asistencia o no para la conferencia con id: ${req.params.idConferencia}.`, codigo:200, estado:'ok', data: data
            });
        };
    });
};


// Obtener lista de asistencia a una conferencia
exports.obtenerListaAsistencia = (req, res) => {
  if(!req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  };

  Asistencia.obtenerListaAsistenciaPorIdConferencia(req.params.idConferencia, (err, data) => {
    console.log(`Se desea obtener la lista de asistencia para la conferencia con id: ${req.params.idConferencia}`);

    if (err) {
      if (err.estado === "no_encontrado") {
        res.status(404).send({
          mensaje: `No se encontró la lista de asistencia para la conferencia con id: ${req.params.idConferencia}`, codigo:404, data:null
        });
      } 
      else {
        console.log(err);
        res.status(500).send({
          mensaje: `Error al obtener la lista de asistencia para la conferencia con id: ${req.params.idConferencia}`
        });
      };

    } else {
      res.send({
        mensaje: `Se obtuvó la lista de asistencia para la conferencia con id: ${req.params.idConferencia}`, codigo:200, estado:'ok', data:data
      });
    };
  });
};


// Obtener los datos necesarios para generar las estadísticas para un evento
exports.obtDatosGrafico= (req, res) => {
  if(!req.params ) {
    res.status(400).send({
      message: "El contenido no puede ser vacio"
    });
    return;
  };

  Asistencia.obtenerDatosGraficos(req.params.idEvento, (err, data) => {
    console.log(`Se desea obtener los datos de las asistencias de las conferencias para generar los gráficos del evento con id: ${req.params.idEvento}`);

    if (err) {
      console.log(err);
      res.status(500).send({
      mensaje: `Error al obtener los datos de las asistencias de las conferencias para generar los gráficos del evento con id: ${req.params.idEvento}`
    });

    } 
    else {
      res.status(200).send({
        mensaje: `Se obtuvieron los datos de las asistencias de las conferencias para generar los gráficos del evento con id: ${req.params.idEvento}`, codigo:200, estado:'ok', data:data
      });
    };
  });
};


