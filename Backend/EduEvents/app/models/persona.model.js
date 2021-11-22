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
const { Console } = require("console");

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
};

Persona.actualizar = (objetoPersona, resultado) => {
    let consulta = `UPDATE Persona SET Nombre = '${objetoPersona.Nombre}', Apellido = '${objetoPersona.Apellido}', Institucion = '${objetoPersona.Institucion}', Formacion_Academica = '${objetoPersona.Formacion_Academica}', Descripcion = '${objetoPersona.Descripcion}', Intereses = '${objetoPersona.Intereses}', Fecha_Nacimiento = '${objetoPersona.Fecha_Nacimiento}', Fotografia = '${objetoPersona.Fotografia}', Correo = '${objetoPersona.Correo}' WHERE Id = ${objetoPersona.Id}`;

    console.log(consulta)
    
    sql.query(consulta, (err, res) => {
        
        if (err) {
          
            resultado(err, null);
            return;
        };        
        resultado(null, { estado:"ok"});
        return;
    });
};


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
            let buff = res[0].Fotografia
            let srcImagen = buff.toString('ascii');
            res[0].Fotografia = srcImagen;
            resultado(null, res[0])

            return;
        }

        // En ultima instancia, no se encontro el usuario con ese correo

        resultado({ estado: "no_encontrado"}, null)

    });
};

Persona.buscarNombreDeCorreo = ( correoPersona, resultado ) => {
    sql.query(`SELECT CONCAT(Nombre, ' ', Apellido) AS Nombre_Completo FROM Persona WHERE Correo = '${correoPersona}'`, (err, res) => {

        if (err){
            return;
        }

        if(res.length){
            // Significa que encontró el nombre completo del usuario con este correo.
            resultado(null, res[0])

            return;
        }

        // En ultima instancia, no se encontro el usuario con dicho correo.
        resultado({ estado: "no_encontrado"}, null)

    });
};

Persona.buscarNombreDeId = ( idPersona, resultado ) => {
    sql.query(`SELECT CONCAT(Nombre, ' ', Apellido) FROM Persona WHERE Id = '${idPersona}'`, (err, res) => {
        if (err){

            resultado(err, null);
            return;
        }

        if(res.length){
            // Significa que encontró el nombre completo del usuario con dicho Id.
            resultado(null, res[0])

            return;
        }

        // En ultima instancia, no se encontro el usuario con dicho correo.
        resultado({ estado: "no_encontrado"}, null)

    });
};


Persona.obtenerPersonas = ( resultado ) => {
    sql.query("SELECT * FROM Persona", (err, res) => {
        if (err) {

          resultado(null, err);
          return;
        }
    
        for (let index = 0; index < res.length; index++) {
            let buff = res[index].Fotografia;
            let srcImagen = buff.toString('ascii');
            res[index].Fotografia = srcImagen;
            
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

                              Persona.buscarNombreDeCorreo(correoPersona, (err,data) => {

                                if (err) {
                                    resultado(err, null);
                                    return;
                                }
        
        
                                const message = {
                                    from: '"EduEvents" <edueventsmanagement@gmail.com>',
                                    to: correoPersona,
                                    subject: "Restablecimiento de Contraseña",
                                    attachments: [
                                    {
                                        filename: 'logo.png',
                                        path: '../EduEvents/app/assets/img/logo.png',
                                        cid: 'logo' 
                                    },
                                    {
                                        filename: 'EduEvents.png',
                                        path: '../EduEvents/app/assets/img/EduEvents.png',
                                        cid: 'EduEvents' 
                                    }
                                ],
                                    html: `

                                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                            <html xmlns="http://www.w3.org/1999/xhtml">
                            <head>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                            <title>[SUBJECT]</title>
                            <style type="text/css">
                            body {
                            padding-top: 0 !important;
                            padding-bottom: 0 !important;
                            padding-top: 0 !important;
                            padding-bottom: 0 !important;
                            margin:0 !important;
                            width: 100% !important;
                            -webkit-text-size-adjust: 100% !important;
                            -ms-text-size-adjust: 100% !important;
                            -webkit-font-smoothing: antialiased !important;
                            }
                            .tableContent img {
                            border: 0 !important;
                            display: block !important;
                            outline: none !important;
                            }

                            p, h2{
                            margin:0;
                            }

                            div,p,ul,h2,h2{
                            margin:0;
                            }

                            h2.bigger,h2.bigger{
                            font-size: 32px;
                            font-weight: normal;
                            }

                            h2.big,h2.big{
                            font-size: 21px;
                            font-weight: normal;
                            }

                            a.link1{
                            color:#62A9D2;font-size:13px;font-weight:bold;text-decoration:none;
                            }

                            a.link2{
                            padding:8px;background:#62A9D2;font-size:13px;color:#ffffff;text-decoration:none;font-weight:bold;
                            }

                            a.link3{
                            background:#62A9D2; color:#ffffff; padding:8px 10px;text-decoration:none;font-size:13px;
                            }
                            .bgBody{
                            background: #F6F6F6;
                            }
                            .bgItem{
                            background: #ffffff;
                            }

                            @media only screen and (max-width:480px)
                                    
                            {
                                    
                            table[class="MainContainer"], td[class="cell"] 
                                {
                                    width: 100% !important;
                                    height:auto !important; 
                                }
                            td[class="specbundle"] 
                                {
                                    width: 100% !important;
                                    float:left !important;
                                    font-size:13px !important;
                                    line-height:17px !important;
                                    display:block !important;
                                    
                                }
                                td[class="specbundle1"] 
                                {
                                    width: 100% !important;
                                    float:left !important;
                                    font-size:13px !important;
                                    line-height:17px !important;
                                    display:block !important;
                                    padding-bottom:20px !important;
                                    
                                }	
                            td[class="specbundle2"] 
                                {
                                    width:90% !important;
                                    float:left !important;
                                    font-size:14px !important;
                                    line-height:18px !important;
                                    display:block !important;
                                    padding-left:5% !important;
                                    padding-right:5% !important;
                                }
                                td[class="specbundle3"] 
                                {
                                    width:90% !important;
                                    float:left !important;
                                    font-size:14px !important;
                                    line-height:18px !important;
                                    display:block !important;
                                    padding-left:5% !important;
                                    padding-right:5% !important;
                                    padding-bottom:20px !important;
                                    text-align:center !important;
                                }
                                td[class="specbundle4"] 
                                {
                                    width: 100% !important;
                                    float:left !important;
                                    font-size:13px !important;
                                    line-height:17px !important;
                                    display:block !important;
                                    padding-bottom:20px !important;
                                    text-align:center !important;
                                    
                                }
                                    
                            td[class="spechide"] 
                                {
                                    display:none !important;
                                }
                                    img[class="banner"] 
                                {
                                        width: 100% !important;
                                        height: auto !important;
                                }
                                    td[class="left_pad"] 
                                {
                                        padding-left:15px !important;
                                        padding-right:15px !important;
                                }
                                    
                            }
                                
                            @media only screen and (max-width:540px) 

                            {
                                    
                            table[class="MainContainer"], td[class="cell"] 
                                {
                                    width: 100% !important;
                                    height:auto !important; 
                                }
                            td[class="specbundle"] 
                                {
                                    width: 100% !important;
                                    float:left !important;
                                    font-size:13px !important;
                                    line-height:17px !important;
                                    display:block !important;
                                    
                                }
                                td[class="specbundle1"] 
                                {
                                    width: 100% !important;
                                    float:left !important;
                                    font-size:13px !important;
                                    line-height:17px !important;
                                    display:block !important;
                                    padding-bottom:20px !important;
                                    
                                }		
                            td[class="specbundle2"] 
                                {
                                    width:90% !important;
                                    float:left !important;
                                    font-size:14px !important;
                                    line-height:18px !important;
                                    display:block !important;
                                    padding-left:5% !important;
                                    padding-right:5% !important;
                                }
                                td[class="specbundle3"] 
                                {
                                    width:90% !important;
                                    float:left !important;
                                    font-size:14px !important;
                                    line-height:18px !important;
                                    display:block !important;
                                    padding-left:5% !important;
                                    padding-right:5% !important;
                                    padding-bottom:20px !important;
                                    text-align:center !important;
                                }
                                td[class="specbundle4"] 
                                {
                                    width: 100% !important;
                                    float:left !important;
                                    font-size:13px !important;
                                    line-height:17px !important;
                                    display:block !important;
                                    padding-bottom:20px !important;
                                    text-align:center !important;
                                    
                                }
                                    
                            td[class="spechide"] 
                                {
                                    display:none !important;
                                }
                                    img[class="banner"] 
                                {
                                        width: 100% !important;
                                        height: auto !important;
                                }
                                    td[class="left_pad"] 
                                {
                                        padding-left:15px !important;
                                        padding-right:15px !important;
                                }
                                    
                                .font{
                                    font-size:15px !important;
                                    line-height:19px !important;
                                    
                                    }
                            }


                            </style>
                            <script type="colorScheme" class="swatch active">
                            {
                                "name":"Default",
                                "bgBody":"F6F6F6",
                                "link":"62A9D2",
                                "color":"999999",
                                "bgItem":"ffffff",
                                "title":"555555"
                            }
                            </script>

                            </head>
                            <body paddingwidth="0" paddingheight="0"   style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0" style="margin-left:5px; margin-right:5px; margin-top:0px; margin-bottom:0px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tableContent bgBody" align="center"  style='font-family:helvetica, sans-serif;'>
                            
                                <!--  =========================== The header ===========================  -->   
                                
                            <tbody>
                            <tr>
                                <td height='25' bgcolor='#D98F45' colspan='3'></td>
                                </tr>
                                <tr>
                                <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                <td height='130' bgcolor='#D98F45'>&nbsp;</td>
                                </tr>
                                <tr>
                                <td>&nbsp;</td>
                                </tr>
                            </tbody>
                            </table>
                            </td>
                                <td valign="top" width="600"><table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="MainContainer" bgcolor="#ffffff">
                            <tbody>
                            <!--  =========================== The body ===========================  -->   
                                <tr>
                                <td class='movableContentContainer'>
                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                            <tr>
                                                <td bgcolor='#D98F45' valign='top'>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                    <tr>
                                                    <td align='left' valign='middle' >
                                                        <div class="contentEditableContainer contentImageEditable">
                                                        <div class="contentEditable" >
                                                            <img src="cid:logo">
                                                        </div>
                                                        </div>
                                                    </td>

                                                    <td align='right' valign='top' >
                                                        <div class="contentEditableContainer contentTextEditable" style='display:inline-block;'>
                                                        <div class="contentEditable" >
                                                           
                                                            <img src="cid:EduEvents">

                                                            <p style='color:black;font-size:13px;text-decoration:none; margin-top:10px'>La mejor plataforma para gestionar tus eventos.</p>
                                                        </div>
                                                        </div>
                                                    </td>
                                                    </tr>
                                                </table>
                                                </td>
                                            </tr>
                                            </table>
                                        </div>
                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                            <tr><td height='25' bgcolor='#D98F45'></td></tr>

                                            <tr><td height='5' style='background-color:rgb(68, 132, 206)'></td></tr>

                                            <tr><td height='40' class='bgItem'></td></tr>

                                            <tr>
                                            <td>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' class='bgItem'>
                                                <tr>
                                                    <td  width='70'></td>
                                                    <td  align='center' width='530'>
                                                    
                                                    </td>
                                                    <td  width='70'></td>
                                                </tr>
                                                <tr>
                                                    <td width='70'></td>
                                                    <td  align='center' width='530'>
                                                    <div class='contentEditableContainer contentTextEditable'>
                                                    <div class="contentEditable" style='font-size:13px;color: black;line-height:19px;'>
                                                    <p style = "margin-top:15px">Hola ${data.Nombre_Completo}, has solicitado recuperar tu contraseña en nuestra plataforma. Copia el siguiente código y pegalo en el campo de "Ingrese su código": ${tok}</span></span></p>
                                                    </div>
                                                </div>
                                                    </td>
                                                    <td  width='70'></td>
                                                </tr>

                                                </table>
                                            </td>
                                            </tr>
                                            </table>
                                        </div>
                                    
                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                    <tr><td height='20'></td></tr>
                                                </table>
                                        </div>
                                        
                                    
                                </td>
                                </tr>
                            </tbody>
                            </table>
                            </td>
                                <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                <td height='130' bgcolor='#D98F45'>&nbsp;</td>
                                </tr>
                                <tr>
                                <td>&nbsp;</td>
                                </tr>
                            </tbody>
                            </table>
                            </td>
                                </tr>
                            </tbody>
                            </table>
                            </td>
                                </tr>
                            </tbody>
                            </table>




                                `
                                };
                                
                                //send email
                                transport.sendMail(message, function (err, info) {
                                    if(err) { 
                                    console.log(err)
                                    resultado(null, { estado:"No enviado"});
                                    return
                                    }
                                
                                    else { 
                                    resultado(null, { estado:"ok"});
                                    return;
                                    }
                                });
        
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