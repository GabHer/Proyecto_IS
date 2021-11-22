module.exports = app => {
    const eventos = require("../controllers/evento.controller");
    // Crear un nuevo evento
    app.post("/eventos/nuevoEvento", eventos.crear);
    
    // Obtener todos los eventos de un usuario
    app.get("/eventos/obtenerMisEventos/:idUsuario", eventos.obtenerEventosUsuario);

    // Obtener un evento por Id de Evento.
    app.get("/eventos/obtenerEventos/:idEvento", eventos.obtenerEventoId);

    // Obtener todos los eventos en la plataforma
    app.get("/eventos/obtenerEventos", eventos.obtenerEventos);

     // Obtener todos los eventos que se encuentran en determinado estado.
     app.get("/eventos/obtenerEventos/:estado", eventos.obtenerEvPorEstado);

    // Obtener todos los eventos que se encuentran en determinado estado para un usuario específico.
    app.get("/eventos/obtenerEventos/:estado/:idUsuario", eventos.obtenerEvPorEstadoUsuario);

    // Eliminar un evento
    app.delete('/eventos/eliminarEvento/:idEvento', eventos.eliminarEvento);
    
}