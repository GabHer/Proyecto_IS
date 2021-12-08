const sql = require("./db.js");
const personas = require("./persona.model");
const conferencias =  require("./conferencia.model");


const Diploma = function(objAsistencia) {
    
};


Diploma.gestionarFirmas = (objetoGestFirmas, resultado) => {


    conferencias.actualizarFirmasAIncluir(objetoGestFirmas, (err, data) => {
        if (err) {  
            resultado(err, null);
            return;
        } 

        else {


            console.log("La firma, " , objetoGestFirmas.imagenFirma)
            if (objetoGestFirmas.imagenFirma != "") {

                var consulta = `SELECT Persona.Id FROM Conferencia JOIN Evento ON Evento.Id = Conferencia.Id_Evento JOIN Persona ON Evento.Id_Organizador = Persona.Id WHERE Conferencia.Id = ${objetoGestFirmas.idConferencia}`;

                console.log(consulta)
    
                sql.query(consulta, (err, res) => {
                    
                    if (err) {
                        resultado(err, null);
                        return;
                    };   
    
                    console.log("La respuesta, " , res)
                    const idOrganizador = res[0]["Id"]
                    objFirmaOrganizador = objetoGestFirmas["idOrganizador"] = idOrganizador

                    nuevoObjGestFirmas = objetoGestFirmas
                    nuevoObjGestFirmas["idPersona"] = idOrganizador

                    personas.actualizarFirma(nuevoObjGestFirmas, (err, data) => {    
                        if (err) {
                            resultado(err, null);
                            return;
                        }
    
                        else {
    
                            var consulta = `UPDATE Conferencia SET Emision_Firmas = 1 WHERE(Firma_Organizador IS NOT NULL) AND (Firma_Encargado IS NOT NULL) AND (Firma_Encargado!=1) AND (Conferencia.Id = ${objetoGestFirmas.idConferencia})`;
    
                            console.log(consulta)
    
                            sql.query(consulta, (err, res) => {
                                
                                if (err) {
                                    resultado(err, null);
                                    return;
                                }  
    
                                else {
                                    resultado(null, { estado:"ok"});
                                    return;
                                }     
                                        
                            });
                        };
    
                    });
                });
            }      
            
            else {
                resultado(null, { estado:"ok"});
                return;
            };
        };
    });
};


Diploma.seleccionFirmas = (idConferencia, resultado) => {

    var consulta = `SELECT IF((Firma_Encargado IS NOT NULL) AND (Firma_Organizador IS NOT NULL), 1, 0) AS Seleccionado_Firmas FROM Conferencia WHERE Conferencia.Id = ${idConferencia}`;

    console.log(consulta)

    sql.query(consulta, (err, res) => {
        
        if (err) {
            resultado(err, null);
            return;
        }
        
        if(res.length) {
            resultado(null, res);
            return;
        }

        else {
            resultado(null, {estado: "no_encontrado"});
            return;
        };
    });
     
};




module.exports = Diploma;


