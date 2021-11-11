/*
    1. Definir el modelo
        crear
        obtener
        eliminar
        actualizar

    2. Crear las rutas

    3. Requerir las rutas en el server.js

    4. Crear el controlador
*/
const sql = require("./db.js");

// Definimos el constructor
const Loging = function( datosAutenticacion ) {
    this.Correo = datosAutenticacion.Correo;
    this.Contrasena = datosAutenticacion.Contrasena;
  };


// Creamos las funciones

Loging.iniciarSesion = ( objLoging, resultado ) => {

    const consulta = `SELECT * FROM Persona WHERE Contrasena = AES_ENCRYPT('${objLoging.Contrasena}', '${objLoging.Contrasena}') AND Correo
    = '${objLoging.Correo}';
    `

    sql.query( consulta , (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        // De lo contrario
        if(res.length){
            // Significa que encontro un usuario con contraseña y correo
            
            resultado(null, res[0])
            return;
        }
        
        // En ultima instancia, no se encontro el usuario con ese correo y contraseña
        resultado({ estado: "no_encontrado"}, null)
      });
}

module.exports = Loging;