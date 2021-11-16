module.exports = app => {
    const personas = require("../controllers/persona.controller.js");

    // Add headers
    // Crear un nuevo usuario
    app.post("/registro", personas.crear);
  
    // Obtener todos los usuarios
    app.get("/registro", personas.obtenerPersonas);
  
    // obtener un usuario por correo
    app.get("/registro/:correo", personas.obtenerPorCorreo);
  

    // actualizar un usuario por id
    app.put("/editar_perfil/:id", personas.actualizarPersona);

    /*
    //obtener usuario por id
    app.get("/perfil/:id",function(req,res) {
        personas.actualizar
    });
    */

    //Actualizar un campo dentro del perfil del usuario
    app.put("/perfil/:id", personas.actualizarDatoPersona);

    // Actualizar la contraseña de un usuario por correo
    app.post("/inicioSesion/restablecerContrasena", personas.actualizarContra);
  
    //Método para probar enviar el correo según un correo.
    app.post("/inicioSesion/restablecer_contrasena/verificar_correo", personas.procesoEnviarCorreo);
    

    //Métdo para validar que el token ingresado sea válido
    app.post("/inciarSesion/restablecer_contrasena/:correo", personas.procesoValidarToken);


    //Método para actualizar la contraseña del usuario
    app.post("/inciarSesion/restablecer_contrasena/cambio_contrasena/:correo", personas.actualizarContra);
    
    

    
  };