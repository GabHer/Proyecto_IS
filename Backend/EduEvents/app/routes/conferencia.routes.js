module.exports = app => {
    const conferencia = require("../controllers/conferencia.controller.js");

    // Add headers
    // Crear una nueva conferencia
    app.post("/conferencia", conferencia.crear);
  
    
  };