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