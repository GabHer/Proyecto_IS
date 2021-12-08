const e = require("express");
const sql = require("./db");

// Constructor del objeto Evento
const Asistencia = function(objAsistencia) {
    
};

Asistencia.actualizar = (objetoAsistencia, resultado) => {

    //Consulta que actualizara el campo de Asitencia a 1 para aquellos usuarios que si asistieron a la conferencia.

    var filasAfectadas = 0;
    for (let i=0; i<objetoAsistencia.listaAsistencia.length; i++) {
        var consultaAsistencia = `UPDATE Persona_Conferencia SET Asistencia = 1 WHERE Id_Persona = ${objetoAsistencia.listaAsistencia[i]} AND Id_Conferencia = ${objetoAsistencia.idConferencia}`;

        sql.query(consultaAsistencia, (err, res) => {
            if(err){
              // Si ocurre un error con la consulta
              resultado(err, null);
              return;
            } 
        });
    };

    //Consulta que actualizara el campo de Asitencia a 0 para aquellos usuarios que no asistieron a la conferencia.
    var consultaNoAsistencia = `UPDATE Persona_Conferencia SET Asistencia = 0 WHERE Asistencia IS NULL AND Id_Conferencia = ${objetoAsistencia.idConferencia}`;

    sql.query(consultaNoAsistencia, (err, res) => {
        if(err){
        // Si ocurre un error con la consulta
        resultado(err, null);
        return;
        
        };

        //Actualizando Asistencia = 1 para El encargado
        var consultaNoAsistencia = `UPDATE Persona_Conferencia SET Asistencia = 1 WHERE Id_Persona = (SELECT DISTINCT Persona.Id From Persona JOIN Conferencia ON Persona.Correo = Conferencia.Correo_Encargado WHERE Conferencia.Id = ${objetoAsistencia.idConferencia}) AND Id_Conferencia = ${objetoAsistencia.idConferencia};
        `;

        sql.query(consultaNoAsistencia, (err, res) => {
            if(err){
            // Si ocurre un error con la consulta
            resultado(err, null);
            return;
            };

            var consultaNoAsistencia = `UPDATE Conferencia SET Emision_Asistencia = 1 WHERE Id = ${objetoAsistencia.idConferencia};
            `;

            sql.query(consultaNoAsistencia, (err, res) => {
                if(err){
                // Si ocurre un error con la consulta
                resultado(err, null);
                return;
                }
                
                else {
                    resultado(null, res);
                    return;
                };
            });
        });
    });

};


Asistencia.emision = (objetoAsistencia, resultado) => {
    //Consulta que obtedrá si la lista de asistencia ya fué emitida
    
    var consultaEmicion = `SELECT Emision_Asistencia FROM Conferencia WHERE Id = ${objetoAsistencia.idConferencia}`;

    sql.query(consultaEmicion, (err, res) => {
        if(err){
            // Si ocurre un error con la consulta
            resultado(err, null);
            return;
        }

        if(res.length){
            resultado(null, res);
            return;
        }

        else {
            resultado(null, {estado: "no_encontrado"});
            return;
        }; 
    });
};


// Obtener los datos para renderizar diplomas
Asistencia.obtenerDatosDiploma = (datosDiploma, resultado) => {
    let consulta = `SELECT * FROM Persona JOIN Persona_Conferencia
                    ON Persona.Id = Persona_Conferencia.Id_Persona
                    JOIN Conferencia ON Persona_Conferencia.Id_Conferencia = Conferencia.Id
                    JOIN Evento ON Conferencia.Id_Evento = Evento.Id
                    WHERE Persona.Id = ${datosDiploma.idPersona} AND Conferencia.Id = ${datosDiploma.idConferencia};`;
    
    sql.query(consulta, (err, res) => {
      if(err) {
        resultado(err, null);
        return;
      };
  
      // Si existe respuesta a la consulta
      if(res.length) {
        resultado(null, res);
        return;
      }
      else {
        // En ultima instancia, no hubo respuesta a la consulta
        resultado({estado: "no_encontrado"}, null);
      };
    });
  };

Asistencia.obtenerDatosEvento = (idConferencia, resultado ) => {
    let consulta = `SELECT Evento.Id, Evento.Caratula, Evento.Nombre, Evento.Institucion, Evento.Descripcion, Evento.Fecha_Inicio, 
                    Evento.Fecha_Final, Evento.Estado_Participantes, Evento.Estado_Evento, Evento.Id_Organizador 
                    FROM Conferencia JOIN Evento
                    ON Conferencia.Id_Evento = Evento.Id
                    WHERE Conferencia.Id = ${idConferencia};`;

    sql.query( consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };

        for( let i = 0; i < res.length; i++) {
            let buff = res[i].Caratula
            let srcImagen = buff.toString('ascii');
            res[i].Caratula = srcImagen;
        };  

        resultado(null, res);
    });
};

Asistencia.obtenerDatosConferencia = (idConferencia, resultado ) => {
    let consulta = `SELECT * FROM Conferencia WHERE Id = ${idConferencia};`;

    sql.query( consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };

        for( let i = 0; i < res.length; i++) {
            let buff = res[i].Imagen
            let srcImagen = buff.toString('ascii');
            res[i].Imagen = srcImagen;
        }; 

        resultado(null, res);
    });
};

Asistencia.obtenerDatosEncargado = (idConferencia, resultado) => {
    let consulta = `SELECT Persona.Nombre, Persona. Apellido, Persona.Correo 
                    FROM Persona JOIN Conferencia
                    ON Persona.Correo = Conferencia.Correo_Encargado 
                    WHERE Conferencia.Id = ${idConferencia};`;

    sql.query(consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };

        resultado(null, res);
    });
};

Asistencia.obtenerDatosOrganizador = (idConferencia, resultado) => {
    let consulta = `SELECT Persona.Nombre, Persona. Apellido, Persona.Correo FROM Persona JOIN Evento 
                    ON Persona.Id = Evento.Id_Organizador JOIN Conferencia
                    ON Evento.Id = Conferencia.Id_Evento
                    WHERE Conferencia.Id = ${idConferencia};`;

    sql.query( consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };

        resultado(null, res);
    });
};

Asistencia.obtenerListaAsistencia = (idConferencia, resultado) => {
    let consulta = `SELECT Persona.Nombre, Persona.Apellido, Persona.Correo FROM Persona JOIN Persona_Conferencia
                    ON Persona.Id = Persona_Conferencia.Id_Persona JOIN Conferencia
                    ON Conferencia.Id = Persona_Conferencia.Id_Conferencia
                    WHERE Persona.Correo <> Conferencia.Correo_Encargado 
                    AND Persona_Conferencia.Asistencia = 1 AND Conferencia.Id = ${idConferencia};`;

    sql.query( consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };

        if(res.length) {
            resultado(null, res);
        }    
        else {
            // En ultima instancia, no se encontró lista de asistencia para esa conferencia
            resultado({ estado: "no_encontrado"}, null);
        };
    });
};

// Obtener lista de asistencia a una conferencia
Asistencia.obtenerListaAsistenciaPorIdConferencia = (idConferencia, resultado ) => {    
    var respuestaJson = {};

    Asistencia.obtenerListaAsistencia(idConferencia, (err, data) => {
        if(err) {
            resultado(err, null);
            return;
        }

        if(data != null) {
            console.log("Lista de asistencia", data);
            respuestaJson["listaAsistencia"] = data;

            Asistencia.obtenerDatosEvento(idConferencia, (err, data) => {    
                if(err) {
                    resultado(err, null);
                    return;
                }
                else {
                    respuestaJson["datosEvento"] = data[0];

                    Asistencia.obtenerDatosConferencia(idConferencia, (err, data) => {    
                        if(err) {
                            resultado(err, null);
                            return;
                        }
                        else {
                            respuestaJson["datosConferencia"] = data[0];
            
                            Asistencia.obtenerDatosEncargado(idConferencia, (err, data) => {    
                                if(err) {
                                    resultado(err, null);
                                    return;
                                }
                                else {
                                    respuestaJson["datosEncargado"] = data[0];

                                    Asistencia.obtenerDatosOrganizador(idConferencia, (err, data) => {
                                        if(err) {
                                            resultado(err, null);
                                            return;
                                        }
                                        else {
                                            respuestaJson["datosOrganizador"] = data[0];

                                            resultado(null, respuestaJson);
                                        };
                                    });  
                                };
                            });
                        };
                    });  
                };
            });
        }
        else {
            resultado({estado: "no_encontrado"}, null);
        };
    });  
};

module.exports = Asistencia;

