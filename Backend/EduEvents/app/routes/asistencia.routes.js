module.exports = app => {
    const asistencia = require("../controllers/asistencia.controller.js");
  
    //Actualizar campo Asistencia para los asistentes y no asistentes.
    app.post("/asistencia", asistencia.actualizarAsistencia);
  
  };