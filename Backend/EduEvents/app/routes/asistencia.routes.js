module.exports = app => {
  const asistencia = require("../controllers/asistencia.controller.js");
  
  // Actualizar campo Asistencia para los asistentes y no asistentes.
  app.post("/asistencia", asistencia.actualizarAsistencia);

<<<<<<< HEAD
    app.get('/asistencia/asistenciaEmision/:idConferencia', asistencia.asistenciaEmision);
=======
  // Obtener los datos del diploma
  app.get('/asistencia/obtenerDatosDiploma/:idConferencia/:idPersona', asistencia.obtenerDatosDiploma);

  app.get('/asistencia/asistenciaEmision/:idConferencia', asistencia.asistenciaEmision);

  // Obtener lista de asistencia para una conferencia
  app.get('/asistencia/obtenerListaAsistenciaPorIdConferencia/:idConferencia', asistencia.obtenerListaAsistencia)
>>>>>>> 1e26a3b57bf59960532947c5676a540867d72ffd
  
};