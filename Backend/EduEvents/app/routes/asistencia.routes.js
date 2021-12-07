module.exports = app => {
    const asistencia = require("../controllers/asistencia.controller.js");
  
    // Actualizar campo Asistencia para los asistentes y no asistentes.
    app.post("/asistencia", asistencia.actualizarAsistencia);

    // Obtener los datos del diploma
    app.get('/asistencia/obtenerDatosDiploma/:idConferencia/:idPersona', asistencia.obtenerDatosDiploma);

    app.get('/asistencia/asistenciaEmision/:idConferencia', asistencia.asistenciaEmision);
  
  };