const e = require("express");
const sql = require("./db");

// Constructor del objeto Evento
const Asistencia = function(objAsistencia) {
    
};

Asistencia.actualizar = (objetoAsistencia, resultado) => {

    //Consulta que actualizara el campo de Asitencia a 1 para aquellos usuarios que si asistieron a la conferencia.
    for (let i=0; i<objetoAsistencia.listaAsistencia.length; i++) {
        var consultaAsistencia = `UPDATE Persona_Conferencia SET Asistencia = 1 WHERE Id_Persona = ${objetoAsistencia.listaAsistencia[i]} AND Id_Conferencia = ${objetoAsistencia.idConferencia}`;

        sql.query(consultaAsistencia, (err, res) => {
            if(err){
              // Si ocurre un error con la consulta
              resultado(err, null);
              return;
            };

            //Solo si se actualizaron filas.
            if(res.affectedRows!=0){
                //Consulta que actualizara el campo de Asitencia a 0 para aquellos usuarios que no asistieron a la conferencia.
                var consultaNoAsistencia = `UPDATE Persona_Conferencia SET Asistencia = 0 WHERE Asistencia IS NULL AND Id_Conferencia = ${objetoAsistencia.idConferencia}`;

                sql.query(consultaNoAsistencia, (err, res) => {
                    if(err){
                    // Si ocurre un error con la consulta
                    resultado(err, null);
                    return;
                    };

                    resultado(null, res)
                });
            }

            else{
                resultado(null, {estado: "no_encontrado"})
            };
        });
    };
};


Asistencia.emicion = (objetoAsistencia, resultado) => {

    //Consulta que obtedrá si la lista de asistencia ya fué emitida
    
    var consultaEmicion = `SELECT Emision_Asistencia FROM Conferencia WHERE Id = ${objetoAsistencia.IdConferencia}`;

    sql.query(consultaEmicion, (err, res) => {
        if(err){
            // Si ocurre un error con la consulta
            resultado(err, null);
            return;
        }

        if(res.fieldCount!=0){
            resultado(null, res) 
        }


        else {
            resultado(null, {estado: "no_encontrado"})
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


  module.exports = Asistencia;