module.exports = app => {
    const eventos = require("../controllers/evento.controller");
    // Crear un nuevo evento
    app.post("/eventos/nuevoEvento", eventos.crear);
    
    // Obtener todos los eventos
    app.get("/eventos/obtenerMisEventos/:idUsuario", eventos.obtenerEventosUsuario);
    
}