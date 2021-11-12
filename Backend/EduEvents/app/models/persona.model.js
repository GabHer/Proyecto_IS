/*
 Definiremos el constructor para el Objeto Persona,aquí y usaremos la conexión de 
 la base de datos anterior para escribir funciones CRUD:
*/

const sql = require("./db.js");
const Token = require("./resetToken.model");
const Crypto =  require("crypto");
const transport = require("../models/enviarCorreo.js");
const configCorreo = require("../config/envemail.config.js");
const { encontrarToken } = require("./resetToken.model");

// constructor del objeto persona
const Persona = function(objPersona) {
    this.Nombre = objPersona.Nombre;
    this.Apellido = objPersona.Apellido;
    this.Institucion = objPersona.Institucion;
    this.Formacion_Academica = objPersona.Formacion_Academica;
    this.Descripcion = objPersona.Descripcion;
    this.Intereses = objPersona.Intereses;
    this.Fecha_Nacimiento = objPersona.Fecha_Nacimiento;
    this.Fotografia = objPersona.Fotografia;
    this.Correo = objPersona.Correo;
    this.Contrasena = objPersona.Contrasena;
    
};





Persona.crear = ( nuevoObjetoPersona, resultado ) => {
    Persona.buscarPorCorreo(nuevoObjetoPersona.Correo, (err, data) => {
        if (err) {
            // Si no se encuentra un usuario registrado con el correo electronico se hace el insert
            consulta = `INSERT INTO Persona (Nombre, Apellido, Institucion, Formacion_Academica, Descripcion, Intereses, Fecha_Nacimiento, Fotografia, Correo, Contrasena) VALUES ('${nuevoObjetoPersona.Nombre}','${nuevoObjetoPersona.Apellido}','${nuevoObjetoPersona.Institucion}','${nuevoObjetoPersona.Formacion_Academica}','${nuevoObjetoPersona.Descripcion}','${nuevoObjetoPersona.Intereses}','${nuevoObjetoPersona.Fecha_Nacimiento}','${nuevoObjetoPersona.Fotografia}','${nuevoObjetoPersona.Correo}',AES_ENCRYPT('${nuevoObjetoPersona.Contrasena}','${nuevoObjetoPersona.Contrasena}'));`
            if (err.estado === "no_encontrado") {
                sql.query( consulta, (err, res) => {
                    if (err) {
                        resultado(err, null);
                        return;
                    }
                    
                    resultado(null, { estado:"ok"});
                    return;
                });
                
            } 
            
        } else{
            // Si el usuario si fue encontrado
            resultado(null, {estado:"no_permitido"});
            return
        }
      });
}

Persona.actualizar = ( parametros, resultado ) => {

}

Persona.actualizarContrasena = (objetoPersona, resultado) => {
    let consulta = `UPDATE Persona SET Contrasena = AES_ENCRYPT('${objetoPersona.Contrasena}','${objetoPersona.Contrasena}') WHERE Correo = '${objetoPersona.Correo}'`

    
    sql.query(consulta, (err, res) => {
        
        if (err) {
          
            resultado(err, null);
            return;
        };        
        resultado(null, { estado:"ok"});
        return;
    });
};


Persona.eliminar = ( correoPersona, resultado ) => {

}


Persona.buscarPorCorreo = ( correoPersona, resultado ) => {
    sql.query(`SELECT * FROM Persona WHERE correo = '${correoPersona}'`, (err, res) => {
        if (err){

            resultado(err, null);
            return;
        }

        if(res.length){
            // Significa que encontro un usuario registrado con este correo
            resultado(null, res[0])
            return;
        }

        // En ultima instancia, no se encontro el usuario con ese correo

        resultado({ estado: "no_encontrado"}, null)

    });
};

Persona.obtenerPersonas = ( resultado ) => {
    sql.query("SELECT * FROM Persona", (err, res) => {
        if (err) {

          resultado(null, err);
          return;
        }
    
        resultado(null, res);
      });
};



Persona.validar = (correoPersona, resultado) => {
    Persona.buscarPorCorreo(correoPersona, (err,data) => {
        if (err) {
            resultado(null, {estado: "no encontrado"});
            return
        }
        else {
            
            Token.actualizarPorCorreo(correoPersona, (err,data) => {
                if (err) {
                    resultado(null, {estado: "no realizado"});
                    return
                }

                else {
                    const tok = Crypto.randomBytes(64).toString('base64');
                    const resetToken = new Token({
                        Correo: correoPersona,
                        Token: tok
                      });
                    
                    Token.crear(resetToken, (err,res) => {
                        if(err){
                            resultado(null, {estado: "no creado"});
                            return
                        }
                        else{

                            const message = {
                                from: '"EduEvents" <edueventsmanagement@gmail.com>',
                                to: correoPersona,
                                subject: "Restablecimiento de Contraseña",
                                text: `Para reestablecer tu contraseña copia y pega el siguiente código en el campo de "validar código": ${resetToken.Token}`
                              };

         
                            
                              //send email
                              transport.sendMail(message, function (err, info) {
                                if(err) { 
   
                                  resultado(null, { estado:"No enviado"});
                                }
                            
                                else { 
         
                                  resultado(null, { estado:"ok"});
                                  return;
                                }
                              });
                        
                        };
                    });

                }
            });
        };
    });
};


Persona.validarToken = (objetoResetToken, resultado ) => {
  Token.borrarTokens (objetoResetToken, (err,data) => {
    if (err) {
        resultado(null, {estado: "Error al intentar eliminar los tokens no válidos"});
        return
    }
    else {
           Token.encontrarToken(objetoResetToken, (err,data) => {
                if (err) {
                    resultado(null, {estado: "no encontrado"});
                    return
                }   
                else {
                    resultado(null, { estado:"ok"});
                    return;
                };
            });
        };   
    });
};


Persona.cambioContrasena = (objetoNuevaContra, resultado ) => {
    Token.actualizarPorCorreo (objetoNuevaContra.Correo, (err,data) => {
      if (err) {
          resultado(null, {estado: "Sin actualizar"});
          return
      }
      else {

        /*
        //Aquí se encripta contra//
        var newSalt = Crypto.randomBytes(64).toString('hex');
        
        var newPassword = Crypto.pbkdf2Sync(objetoNuevaContra.Contrasena, newSalt, 10000, 64, 'sha512').toString('base64');

        ///////////////////////////
        */
          
          Persona.actualizarContrasena(objetoNuevaContra, (err,data) => {
                  if (err) {
                      resultado(null, {estado: "no actualizado"});
                      return
                  }   
                  else {
                      resultado(null, { estado:"ok"});
                      return;
                  };
              });
          };   
      });
  };


module.exports = Persona;