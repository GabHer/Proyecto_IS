module.exports = app => {
    const eventos = require("../controllers/evento.controller");
    console.log("Evento>>>>", eventos);
    // Crear un nuevo evento
    app.post("/nuevoEvento", eventos.crear);
  
    // Obtener todos los eventos
    
}