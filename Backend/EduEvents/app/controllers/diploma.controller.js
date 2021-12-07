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