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
    /*
    app.pot("/registro/:correo",function(req,res) {
        personas.actualizar
    });
    */

    // Actualizar la contraseña de un usuario por correo
    app.post("/inicioSesion/restablecerContrasena", personas.actualizarContra);
  
    // Eliminar un usuario por correo
    /*app.delete("/registro/:correo", personas.eliminar)*/;


    /*
    //Enviar código al usuario
    app.get("/inicioSesion/restablecer_contrasena/:correo" ,personas.reestablecer_contrasena);
    */


    /*app.post("/inicioSesion/guardar_token", personas.guardarResetToken);

    app.put("/inicioSesion/actualizar_token/:correo", personas.actualizarToken);
    */




    //Método para probar enviar el correo según un correo.
    app.post("/inicioSesion/restablecer_contrasena/verificar_correo", personas.procesoEnviarCorreo);
    

    //Métdo para validar que el token ingresado sea válido
    app.post("/inciarSesion/restablecer_contrasena/:correo", personas.procesoValidarToken);


    //Método para actualizar la contraseña del usuario
    app.post("/inciarSesion/restablecer_contrasena/cambio_contrasena/:correo", personas.actualizarContra);
    
    
    /*
    
    app.delete("/iniciarSesion/borrarTokens", personas.borrarTokensExpirados);


    app.post("/iniciarSesion/encontrarToken", personas.encontrarToken)
    */

    

    /*
    app.post("/iniciarSesion/enviarCorreo",personas.enviarCorreo);
    */
    
  };