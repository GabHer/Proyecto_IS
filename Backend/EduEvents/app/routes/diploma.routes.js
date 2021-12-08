module.exports = app => {
    const diploma = require("../controllers/diploma.controller.js");
  
    // Actualizar que firmas se necesitan, posiblemente guardar la firma del organizador, y posiblemente también actualizar el campo de Emision_Firmas para determinada conferencia.
    app.post("/diplomas/gestionFirmas", diploma.gestionFirmas);

    app.get("/diplomas/seleccionFirmas/:idConferencia", diploma.seleccionadoFirmas);
  
  };