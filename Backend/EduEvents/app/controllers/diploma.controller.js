const Diploma = require("../models/diploma.model.js");


exports.gestionFirmas = (req, res) => {
  
    if(!req.body) {
      res.status(400).send({
        message: "El contenido no puede ser vacio"
      });
      return;
    };
  
    Diploma.gestionarFirmas (req.body, (err, data) => {
  
      if(err){
        res.status(500).send({mensaje: "Ocurrió un error al intentar actualizar los campos de Firma_Organizador y Firma_Encargado y/o al guardar la firma del Organizador y/o al actualizar el campo de Emision_Firmas para esta conferencia", error:err});
        return;
      }
  
      else {
        res.status(200).send({mensaje:`Se realizó de forma correcta la actualización de los campos de Firma_Organizador y Firma_Encargado, (y) el almacenamiento de la firma del Organizador, (y) la actualización del campo de Emision_Firmas para esta conferencia: ${req.body.idConferencia}`, codigo:200, estado:"ok"});
        return;
      };
    });
  };


exports.seleccionadoFirmas = (req, res) => {
  if(!req.params) {
      res.status(400).send({
      message: "El contenido no puede ser vacío"
      });
      return;
  };

  Diploma.seleccionFirmas(req.params.idConferencia, (err, data) => {

    if(err) {
        res.status(500).send({
        mensaje: "Error al obtener si se han seleccionado que firmas se incluirán en los diplomas para la conferencia con id : " + req.params.idConferencia
        });
    } 

    if (data.estado == "no_encontrado") {
        res.status(404).send({
            mensaje: `El id de Conferencia no exite.`, codigo:404, data:null
        });
      }

    else {
        res.status(200).send({
            mensaje: `Se ha obtenido si se ha seleccionado que firmas irán en los diplomas de la conferencia con id: ${req.params.idConferencia}.`, codigo:200, estado:'ok', data: data
        });
      };
    });
  };


  exports.guardarFirmaEncargado = (req, res) => {

    if(!req.body) {
        res.status(400).send({
        message: "El contenido no puede ser vacío"
        });
      return;
    };
  
    Diploma.guardarFirmaEncargado(req.body, (err, data) => {
      
      if(err) {
          res.status(500).send({
          mensaje: "Error al intentar guardar la firma del encargado para la conferencia con id : " + req.body.idConferencia
          });
      } 
  
      if (data.estado == "no_permitido") {
          res.status(404).send({
              mensaje: `No se han seleccionado las firmas a incluir en los diplomas para esta conferencia o no es requerida la firma del encargado para los diplomas de esta conferencia o el encargado ya subió su firma.`, codigo:404, data:null
          });
        }
  
      else {
          res.status(200).send({
              mensaje: `Se ha guardado la firma del encargado para la conferencia con id: ${req.body.idConferencia}.`, codigo:200, estado:'ok', data: null
          });
        };
      });
    };


exports.obtenerDatosDiploma = (req, res) => {

if(!req.params) {
    res.status(400).send({
    message: "El contenido no puede ser vacío"
    });
  return;
};

Diploma.obtDatosDiploma(req.params, (err, data) => {
  
  if(err) {
      res.status(500).send({
      mensaje: "Error al intentar obtener los datos necesarios para generar el diploma de la conferencia con id : " + req.params.idConferencia + " para la persona con id: " + req.params.idPersona
      });
  } 

  if (data.estado == "no_permitido") {
      res.status(404).send({
          mensaje: `Usted no asistió a esta conferencia.`, codigo:404, data:null
      });
    }

  else {
      res.status(200).send({
          mensaje: `Se han obtenido los datos necesarios para generar el diploma para la conferencia con id: ${req.params.idConferencia} para la persona con id: ${req.params.idPersona}`, codigo:200, estado:'ok', data: data
      });
    };
  });
};