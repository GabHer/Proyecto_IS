const sql = require("./db.js");
const personas = require("./persona.model");
const Evento = require("./evento.model.js");
const Conferencia = require("./conferencia.model");


const Diploma = function(objAsistencia) {
    
};


Diploma.gestionarFirmas = (objetoGestFirmas, resultado) => {
    conferencia.actualizarFirmasAIncluir(objetoGestFirmas, (err, data) => {
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



Diploma.obtDatosDiploma = (datosEntrada, resultado) => {

    var respuestaJSON = {};
    var idEvento = 0;
    var idOrganizador = 0;
    var idEncargado = 0;
    var incluyeOrganizador = 0;
    var incluyeEncargado = 0;

    var consulta = `SELECT Asistencia FROM Persona_Conferencia WHERE Id_Conferencia = ${datosEntrada.idConferencia} AND Id_Persona = ${datosEntrada.idPersona}`;

    sql.query(consulta, (err, res) => {
        
        if (err) {
            resultado(err, null);
            return;
        }

        if (res[0].Asistencia == 1){

            var consulta = `SELECT Evento.Id AS Id_Evento, Persona.Id AS Id_Encargado, Evento.Id_Organizador AS Id_Organizador FROM Conferencia JOIN Evento ON Conferencia.Id_Evento = Evento.Id JOIN Persona ON Conferencia.Correo_Encargado = Persona.Correo WHERE Conferencia.Id = ${datosEntrada.idConferencia};`;

            sql.query(consulta, (err, res) => {
                
                if (err) {
                    resultado(err, null);
                    return;
                }

                idEvento = res[0]["Id_Evento"];
                idOrganizador = res[0]["Id_Organizador"];
                idEncargado = res[0]["Id_Encargado"];
            

                Evento.obtenerEventoPorId(idEvento, (err, data) => {    
                    if (err) {
                        resultado(err, null);
                        return;
                    }

                    else {

                        respuestaJSON["Evento"] = data[0];

                        Conferencia.obtenerConferenciaPorId(datosEntrada.idConferencia, (err, data) => {    
                            if (err) {
                                resultado(err, null);
                                return;
                            }
        
                            else {
                                respuestaJSON["Conferencia"] = data[0];
                    
                                personas.buscarPorId(datosEntrada.idPersona, (err, data) => {    
                                    if (err) {
                                        resultado(err, null);
                                        return;
                                    }
                
                                    else {
                                        respuestaJSON["Asistente"] = data;

                                        personas.buscarPorId(idOrganizador, (err, data) => {    
                                            if (err) {
                                                resultado(err, null);
                                                return;
                                            }
                        
                                            else {
                                                respuestaJSON["Organizador"] = data;
                                        
                                                personas.buscarPorId(idEncargado, (err, data) => {    
                                                    if (err) {
                                                        resultado(err, null);
                                                        return;
                                                    }
                                
                                                    else {
                                                        respuestaJSON["Encargado"] = data;
                                                    
                                                        var consulta = `SELECT Firma_Organizador, Firma_Encargado FROM Conferencia WHERE Id = ${datosEntrada.idConferencia}`;
                                            
                                                        sql.query(consulta, (err, res) => {
                                                            
                                                            if (err) {
                                                                resultado(err, null);
                                                                return;
                                                            }

                                                            else {  

                                                                    incluyeOrganizador = res[0].Firma_Organizador;
                                                                    incluyeEncargado = res[0].Firma_Encargado;

                                                                    var entrada = { 
                                                                                    inclusionFirmaOrganizador: incluyeOrganizador,
                                                                                    inclusionFirmaEncargado: incluyeEncargado,
                                                                                    idPersonaOrganizador: idOrganizador,
                                                                                    idPersonaEncargado: idEncargado
                                                                                  }

                                                                        Diploma.obtenerDatosFirmas(entrada, (err, data) => {    
                                                                        if (err) {
                                                                            resultado(err, null);
                                                                            return;
                                                                        }
                                                                        else {
                                                                        
                                                                            respuestaJSON["Firmas"] = data

                                                                            resultado(null, respuestaJSON);
                                                                            return;
                                                                            
                                                                        };
                                                                    });

                                                                }
                                                        });
                                                    };
                                
                                                });
                                            };
                        
                                        });
                                    };
                                });
                            };
        
                        });
                    };

                });
            });
        }

        else {
            resultado(null, {estado: "no_permitido"});
            return;
        };
    });
};


Diploma.obtenerDatosFirmas = (objDatosObtFirma, resultado) => {


    if (objDatosObtFirma.inclusionFirmaOrganizador == 1){

        var respuestJSON2 = new Array();
        var consulta1 = `SELECT "Organizador" AS Rol, CONCAT(Nombre, ' ', Apellido) AS Nombre_Completo, Firma FROM Persona WHERE Id = ${objDatosObtFirma.idPersonaOrganizador}`;

        sql.query(consulta1, (err, res) => {

            if (err) {
                resultado(err, null);
                return;
            }

            else {
                let buff2 = res[0]["Firma"]
                let srcImagen2 = buff2.toString('ascii');
                res[0]["Firma"] = srcImagen2;
                

                respuestJSON2.push(res[0]);
            
                
                if (objDatosObtFirma.inclusionFirmaEncargado == 1){
                    var consulta2 = `SELECT "Encargado" AS Rol, CONCAT(Nombre, ' ', Apellido) AS Nombre_Completo, Firma FROM Persona WHERE Id = ${objDatosObtFirma.idPersonaEncargado}`;

                    sql.query(consulta2, (err, res) => {

                        if (err) {
                            resultado(err, null);
                            return;
                        }

                        else {
                            let buff2 = res[0]["Firma"]
                            let srcImagen2 = buff2.toString('ascii');
                            res[0]["Firma"] = srcImagen2;

                            respuestJSON2.push(res[0]);
                            resultado(null, respuestJSON2);
                            return;
                        };
                    });
                }

                else {
                    resultado(null, respuestJSON2);
                    return;
                }

               
            };
        });
    };


    if ((objDatosObtFirma.inclusionFirmaEncargado == 1) && (objDatosObtFirma.inclusionFirmaOrganizador == 0)){

        var respuestJSON2 = new Array();

        var consulta2 = `SELECT "Encargado" AS Rol, CONCAT(Nombre, ' ', Apellido) AS Nombre_Completo, Firma FROM Persona WHERE Id = ${objDatosObtFirma.idPersonaEncargado}`;

        sql.query(consulta2, (err, res) => {

            if (err) {
                resultado(err, null);
                return;
            }

            else {
                let buff2 = res[0]["Firma"]
                let srcImagen2 = buff2.toString('ascii');
                res[0]["Firma"] = srcImagen2;

                respuestJSON2.push(res[0]);


                if (objDatosObtFirma.inclusionFirmaOrganizador == 1){
                    var consulta1 = `SELECT "Organizador" AS Rol, CONCAT(Nombre, ' ', Apellido) AS Nombre_Completo, Firma FROM Persona WHERE Id = ${objDatosObtFirma.idPersonaOrganizador}`;
            
                    sql.query(consulta1, (err, res) => {
            
                        if (err) {
                            resultado(err, null);
                            return;
                        }
            
                        else {
                            let buff2 = res[0]["Firma"]
                            let srcImagen2 = buff2.toString('ascii');
                            res[0]["Firma"] = srcImagen2;
                            
            
                            respuestJSON2.push(res[0]);

                            resultado(null, respuestJSON2);
                            return;
                        }
                    });
                }

                else {
                    resultado(null, respuestJSON2);
                    return;
                };
            };
        });
    };
};

 
module.exports = Diploma;


