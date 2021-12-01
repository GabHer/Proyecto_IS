module.exports = app => {
  const conferencia = require("../controllers/conferencia.controller.js");

  // Add headers
  // Crear una nueva conferencia
  app.post("/conferencia", conferencia.crear);

  // Obtener todas las conferencias en la plataforma
  app.get("/conferencia/obtenerConferencias", conferencia.obtenerConferencias);

  // Obtener todas las conferencias por Id de Evento
  app.get("/conferencia/obtenerConferenciasPorIdEvento/:idEvento", conferencia.obtenerConferenciasIdEvento);

  // Obtener todas las conferencias en las que está inscrito un usuario
  app.get("/conferencia/obtenerConferenciasPorIdUsuario/:idUsuario", conferencia.obtenerConferenciasIdUsuario);

  // Eliminar una Conferencia
  app.delete("/conferencia/eliminarConferencia/:idConferencia", conferencia.eliminarConferencia);

};

