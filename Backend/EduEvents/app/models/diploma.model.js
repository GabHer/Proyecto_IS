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

            if (objetoGestFirmas.imagenFirma != "") {

                var consulta = `SELECT Persona.Id FROM Conferencia JOIN Evento ON Evento.Id = Conferencia.Id_Evento JOIN Persona ON Evento.Id_Organizador = Persona.Id WHERE Conferencia.Id = ${objetoGestFirmas.idConferencia}`;
    
                sql.query(consulta, (err, res) => {
                    
                    if (err) {
                        resultado(err, null);
                        return;
                    };   
    
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


Diploma.guardarFirmaEncargado = (objFirmaEncargado, resultado) => {

    var consulta = `SELECT IF((Firma_Encargado IS NOT NULL) AND (Firma_Organizador IS NOT NULL) AND (Firma_Encargado = 1) AND (Emision_Firmas = 0), 1, 0) AS Firma_Encargado_Requerida FROM Conferencia WHERE Conferencia.Id = ${objFirmaEncargado.idConferencia}`;

    sql.query(consulta, (err, res) => {
        
        if (err) {
            resultado(err, null);
            return;
        }
    
        const requiereFirma = res[0]["Firma_Encargado_Requerida"];
        

        if(requiereFirma == 1) {

            var consulta = `UPDATE Persona SET Firma = "${objFirmaEncargado.imagenFirma}" WHERE Id = ${objFirmaEncargado.idEncargado}`;
        
            sql.query(consulta, (err, res) => {
                
                if (err) {
                    resultado(err, null);
                    return;
                }

                else {

                    var consulta = `UPDATE Conferencia SET Emision_Firmas = 1 WHERE Id = ${objFirmaEncargado.idConferencia}`;
                
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
                }    
            });
        }

        else {
            resultado(null, {estado: "no_permitido"});
            return;
        }
    });
};





module.exports = Diploma;


