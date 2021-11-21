module.exports = app => {
    const eventos = require("../controllers/evento.controller");
    // Crear un nuevo evento
    app.post("/eventos/nuevoEvento", eventos.crear);
    
    // Obtener todos los eventos de un usuario
    app.get("/eventos/obtenerMisEventos/:idUsuario", eventos.obtenerEventosUsuario);

    // Obtener todos los eventos en la plataforma
    app.get("/eventos/obtenerEventos", eventos.obtenerEventos);

    // Eliminar un evento
    app.delete('/eventos/eliminarEvento/:idEvento', eventos.eliminarEvento);
    
}