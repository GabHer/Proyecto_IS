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
        console.log(err);
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