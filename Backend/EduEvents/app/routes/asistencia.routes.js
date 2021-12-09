module.exports = app => {
  const asistencia = require("../controllers/asistencia.controller.js");
  
  // Actualizar campo Asistencia para los asistentes y no asistentes.
  app.post("/asistencia", asistencia.actualizarAsistencia);

  app.get('/asistencia/asistenciaEmision/:idConferencia', asistencia.asistenciaEmision);

  // Obtener lista de asistencia para una conferencia
  app.get('/asistencia/obtenerListaAsistenciaPorIdConferencia/:idConferencia', asistencia.obtenerListaAsistencia)

  //Obtener los datos de las asistencias de las conferencias de un Evento con determinado id
  app.get('/asistencia/datosGraficos/:idEvento', asistencia.obtDatosGrafico);
  
};