const Asistencia = require("../models/asistencia.model");

// Actualizar el campo asistencia para todas las personas incritas a una conferencia.
exports.actualizarAsistencia = (req, res) => {
  if(!req.params) {
    res.status(400).send({
      message: "El contenido no puede ser vacío"
    });
    return;
  };
  
  Asistencia.actualizar(req.body, (err, data) => {
    console.log("Se actualiza el campo de 'Asistencia' para los inscritos en la conferencia con Id: " + req.body.idConferencia);
  
    if(err) {
      console.log(err);
      res.status(500).send({
        mensaje: "Error al actualizar el campo de 'Asistencia' para los inscritos en la conferencia con Id: " + req.body.idConferencia
      });
    } 
    else {
      res.send({
        mensaje: `Se actualizó el campo de 'Asistencia' para los inscritos en la conferencia con Id: ${req.body.idConferencia}.`, codigo:200, estado:'ok', data: data
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
  
