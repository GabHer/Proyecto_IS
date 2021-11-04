module.exports = app => {
    const personas = require("../controllers/persona.controller.js");
// Add headers
    // Crear un nuevo usuario
    app.post("/registro", personas.crear);
  
    // Obtener todos los usuarios
    app.get("/registro", personas.obtenerPersonas);
  
    // obtener un usuario por correo
    app.get("/registro/:correo", personas.obtenerPorCorreo);
  
    // actualizar un usuario por correo
    app.put("/registro/:correo", personas.actualizar);
  
    // Eliminar un usuario por correo
    app.delete("/registro/:correo", personas.eliminar);
  

  };