module.exports = app => {
    const eventos = require("../controllers/evento.controller");
    // Crear un nuevo evento
    app.post("/eventos/nuevoEvento", eventos.crear);
    
    // Obtener todos los eventos de un usuario
    app.get("/eventos/obtenerMisEventos/:idUsuario", eventos.obtenerEventosUsuario);

    // Obtener un evento por Id de Evento.
    app.get("/eventos/obtenerEventoPorId/:idEvento", eventos.obtenerEventoId);

    // Obtener todos los eventos en la plataforma
    app.get("/eventos/obtenerEventos", eventos.obtenerEventos);

     // Obtener todos los eventos que se encuentran en determinado estado.
     app.get("/eventos/obtenerEventosPorEstado/:estado", eventos.obtenerEvPorEstado);

    // Obtener todos los eventos que se encuentran en determinado estado para un usuario específico.
    app.get("/eventos/obtenerEventosPorEstadoYUsuario/:estado/:idUsuario", eventos.obtenerEvPorEstadoUsuario);

    // Obtener todos los eventos cuyas fechas de inicio y/o fechas de fin estan entre el rango de fechas proporcionado.
    app.get("/eventos/obtenerEventosPorFecha/:fechaInicio/:fechaFinal", eventos.obtenerEventosFecha);

    // Obtener todos los eventos cuyas fechas de inicio y/o fechas de fin estan entre el rango de fechas proporcionado.
    app.get("/eventos/obtenerEventosPorFechaYOrganizador/:fechaInicio/:fechaFinal/:idOrganizador", eventos.obtenerEventosFechaOrganizador);

    // Obtener las imágenes del evento con id
    app.get("/eventos/obtenerImagenesEvento/:idEvento", eventos.obtenerImagenes);

    // Eliminar un evento
    app.delete('/eventos/eliminarEvento/:idEvento', eventos.eliminarEvento);
    
}