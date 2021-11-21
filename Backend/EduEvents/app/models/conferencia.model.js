const { query } = require("express");
const sql = require("./db.js");
const transport = require("../models/enviarCorreo.js");
const configCorreo = require("../config/envemail.config.js");

// constructor del objeto Conferencia
const Conferencia = function(objConferencia) {
    this.Id_Evento = objConferencia.Id_Evento
    this.Tipo = objConferencia.Tipo;
    this.Nombre = objConferencia.Nombre;
    this.Descripcion = objConferencia.Descripcion;
    this.Modalidad = objConferencia.Modalidad;
    this.Medio = objConferencia.Medio;
    this.Correo_Encargado = objConferencia.Correo_Encargado;
    this.Fecha_Inicio = objConferencia.Fecha_Inicio;
    this.Hora_Inicio = objConferencia.Hora_Inicio;
    this.Hora_Final = objConferencia.Hora_Final;
    this.Imagen = objConferencia.Imagen;
    this.Limite_Participantes = objConferencia.Limite_Participantes;
};


Conferencia.buscarPorNombre = ( datosConferencia , resultado ) => {
    sql.query(`SELECT * FROM CONFERENCIA WHERE Id_Evento = ${datosConferencia.Id_Evento} AND Nombre = '${datosConferencia.Nombre}'`, (err, res) => {
        if (err){
            resultado(err, null);
            return;
        }

        if(res.length){
            // Significa que se encontró otra conferencia creada con el mismo nombre dentro del mismo evento.
            resultado(null, res[0])

            return;
        }

        // En ultima instancia, no se encontró otra conferencia con ese nombre dentro del mismo evento.

        resultado({ estado: "no_encontrado"}, null)

    });
};


Conferencia.crear = ( objConferencia, resultado ) => {
    Conferencia.buscarPorNombre(objConferencia, (err, data) => {
        if (err) {
            // Si no se encuentra una conferencia existente con ese nombre dentro del mismo evento.
            consulta = `INSERT INTO Conferencia (Id_Evento, Tipo, Nombre, Descripcion, Modalidad, Medio, Correo_Encargado, Fecha_Inicio, Hora_Inicio, Hora_Final, Imagen, Limite_Participantes) VALUES (${objConferencia.Id_Evento},'${objConferencia.Tipo}','${objConferencia.Nombre}','${objConferencia.Descripcion}','${objConferencia.Modalidad}','${objConferencia.Medio}','${objConferencia.Correo_Encargado}','${objConferencia.Fecha_Inicio}','${objConferencia.Hora_Inicio}','${objConferencia.Hora_Final}','${objConferencia.Imagen}','${objConferencia.Limite_Participantes}');`
            if (err.estado === "no_encontrado") {
                sql.query( consulta, (err, res) => {
                    if (err) {
                        resultado(err, null);
                        return;
                    }
                    
                    const message = {
                        from: '"EduEvents" <edueventsmanagement@gmail.com>',
                        to: objConferencia.Correo_Encargado,
                        subject: "Encargado De Conferencia",
                        attachments: [{
                            filename: 'logo.png',
                            path: '../EduEvents/app/assets/img/logo.png',
                            cid: 'logo' 
                       },
                       {
                            filename: 'bigImg.jpg',
                            path: '../EduEvents/app/assets/img/bigImg.jpg',
                            cid: 'bigImg' 
                        },
                        {
                            filename: 'facebook.png',
                            path: '../EduEvents/app/assets/img/facebook.png',
                            cid: 'facebook' 
                        },
                        {
                            filename: 'openBrowser.png',
                            path: '../EduEvents/app/assets/img/openBrowser.png',
                            cid: 'openBrowser' 
                        },
                        {
                            filename: 'twitter.png',
                            path: '../EduEvents/app/assets/img/twitter.png',
                            cid: 'twitter' 
                        }
                       
                    ],
                        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                              <td height='25' bgcolor='#43474A' colspan='3'></td>
                            </tr>
                            <tr>
                              <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td valign="top" class="spechide"><table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td height='130' bgcolor='#43474A'>&nbsp;</td>
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
                                            <td bgcolor='#43474A' valign='top'>
                                              <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                <tr>
                                                  <td align='left' valign='middle' >
                                                    <div class="contentEditableContainer contentImageEditable">
                                                      <div class="contentEditable" >
                                                        <img src="cid:logo" alt='Compagnie logo' data-default="placeholder" data-max-width="300" width='116' height='22'>
                                                      </div>
                                                    </div>
                                                  </td>
                        
                                                  <td align='right' valign='top' >
                                                    <div class="contentEditableContainer contentTextEditable" style='display:inline-block;'>
                                                      <div class="contentEditable" >
                                                        <a target='_blank' href="[SHOWEMAIL]" style='color:#A8B0B6;font-size:13px;text-decoration:none;'>If you have trouble viewing this email, click here.</a>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td width='18' align='right' valign='top'>
                                                    <div class="contentEditableContainer contentImageEditable" style='display:inline-block;'>
                                                      <div class="contentEditable" >
                                                        <a target='_blank' href="[SHOWEMAIL]"><img src="cid:openBrowser" alt='open in browser image' data-default="placeholder" width='15' height='15' style='padding-left:10px;'></a>
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
                                          <tr><td height='25' bgcolor='#43474A'></td></tr>
                        
                                        <tr><td height='5' bgcolor='#62A9D2'></td></tr>
                        
                                        <tr><td height='40' class='bgItem'></td></tr>
                        
                                        <tr>
                                          <td>
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' class='bgItem'>
                                              <tr>
                                                <td  width='70'></td>
                                                <td  align='center' width='530'>
                                                  <div class='contentEditableContainer contentTextEditable'>
                                                    <div class="contentEditable" style='font-size:32px;color:#555555;font-weight:normal;'>
                                                      <h2 style='font-size:32px;'>Who we are</h2>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td  width='70'></td>
                                              </tr>
                        
                                              <tr><td colspan='3' height='22' ></td></tr>
                        
                                              <tr>
                                                <td width='70'></td>
                                                <td  align='center' width='530'>
                                                  <div class='contentEditableContainer contentTextEditable'>
                                                    <div class="contentEditable" style='font-size:13px;color:#99A1A6;line-height:19px;'>
                                                      <p >Give information about your lifestyle, philosophy or what the impact you’re trying to make is.</p>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td  width='70'></td>
                                              </tr>
                        
                                              <tr><td colspan='3' height='45' ></td></tr>
                        
                                            </table>
                                          </td>
                                        </tr>
                                        </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                          <tr><td height='10' bgcolor='#62A9D2'></td></tr>
                                            <tr>
                                              <td>
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' bgcolor='62A9D2'>
                                                  <tr>
                                                    <td width='25'></td>
                                                    <td width='475' valign='middle'>
                                                      <div class='contentEditableContainer contentTextEditable'>
                                                        <div class="contentEditable" style='font-family:Georgia;font-style:italic;color:#0F4666;font-size:15px;line-height:19px;'>
                                                          <p style='color:#0F4666;'>Stay in Touch!</p>
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td width='45' valign='top'>
                                                      <div class='contentEditableContainer contentFacebookEditable'>
                                                        <div class="contentEditable">
                                                          <img src="cid:facebook" alt='facebook' data-default="placeholder" data-customIcon="true" data-max-width='45' width='45' height='45' >
                                                        </div>
                                                      </div>
                                                    </td>
                                                    <td width='10'></td>
                                                    <td width='45' valign='top'>
                                                      <div class='contentEditableContainer contentTwitterEditable'>
                                                        <div class="contentEditable">
                                                          <img src="cid:twitter" alt='Twitter' data-default="placeholder" data-customIcon="true" data-max-width='45' width='45' height='45' >
                                                        </div>
                                                      </div>  
                                                    </td>
                                                    <td width='10'></td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr><td height='10' bgcolor='#62A9D2'></td></tr>
                                        </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                <tr><td height='20'></td></tr>
                                              </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                <tr>
                                                  <td>
                                                    <div class='contentEditableContainer contentImageEditable'>
                                                      <div class="contentEditable">
                                                        <img class="banner" src="cid:bigImg" alt='What we do' data-default="placeholder" data-max-width="600" width='600' height='180' >
                                                      </div>
                                                    </div>
                                                  </td>
                                                </tr>
                                                <tr><td height='10' bgcolor='#000000'></td></tr>
                                                <tr>
                                                  <td bgcolor='#000000' style='padding:8px 0;'>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td width="20" class="spechide">&nbsp;</td>
                              <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td align='left' valign='top' width='370' class="specbundle3">
                                                          <div class='contentEditableContainer contentTextEditable'>
                                                            <div class="contentEditable" style='color:#ffffff;font-size:21px;line-height:19px;'>
                                                              <p ><span class="font">Something Cleverfont</p>
                                                            </div>
                                                          </div>
                                                        </td>
                                                        <td width='20' class="specbundle2"></td>
                                                        <td class="specbundle2" align='center' valign='middle' width='180'>
                                                          <div class='contentEditableContainer contentTextEditable'>
                                                            <div class="contentEditable">
                                                              <a target='_blank' class='link3' href="#" style='background:#62A9D2; color:#ffffff; padding:8px 10px;text-decoration:none;font-size:13px;'>Find out more</a>
                                                            </div>
                                                          </div>
                                                        </td>
                            </tr>
                          </tbody>
                        </table>
                        </td>
                              <td width="20" class="spechide">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                        
                                                  </td>
                                                </tr>
                                                <tr><td height='10' bgcolor='#000000'></td></tr>
                                              </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                <tr><td height='20'></td></tr>
                                              </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                <tr>
                                                  <td width='291' class="specbundle2" valign='top'>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                      <tr><td height='15' colspan='3'></td></tr>
                        
                                                      <tr>
                                                        <td width='20'></td>
                                                        <td width='251'>
                                                          <table width="251" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                            <tr>
                                                              <td>
                                                                <div class='contentEditableContainer contentTextEditable'>
                                                                  <div class='contentEditable' style='color:#555555;font-size:21px;font-weight:normal;'>
                                                                    <h2 class='big' >Quick tip</h2>
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                            <tr><td height='16'></td></tr>
                                                            <tr>
                                                              <td>
                                                                <div class='contentEditableContainer contentTextEditable'>
                                                                  <div class='contentEditable' style='color:#999999;font-size:13px;line-height:19px;'>
                                                                    <p >Give a quick tip about an improvement to lifestyle - such as a nutrition, breathing or meditation. Give more information on a landing page.</p>
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                            <tr><td height='16'></td></tr>
                                                            <tr>
                                                              <td>
                                                                <div class='contentEditableContainer contentTextEditable'>
                                                                  <div class='contentEditable'>
                                                                    <a target='_blank' class='link1' href="#" >Read more</a>
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                        <td width='20'></td>
                                                      </tr>
                        
                                                      <tr><td height='15' colspan='3'></td></tr>
                                                    </table>
                                                  </td>
                        
                                                  <td width='18' valign="top" class="specbundle2">&nbsp;</td>
                                                  
                                                  <td width='291' class="specbundle2" valign='top'>
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                      <tr><td height='15' colspan='3'></td></tr>
                        
                                                      <tr>
                                                        <td width='20'></td>
                                                        <td width='251'>
                                                          <table width="251" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                            <tr>
                                                              <td>
                                                                <div class='contentEditableContainer contentTextEditable'>
                                                                  <div class='contentEditable' style='color:#555555;font-size:21px;font-weight:normal;'>
                                                                    <h2 class='big'>Invite people to a class</h2>
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                            <tr><td height='16'></td></tr>
                                                            <tr>
                                                              <td>
                                                                <div class='contentEditableContainer contentTextEditable'>
                                                                  <div class='contentEditable' style='color:#999999;font-size:13px;line-height:19px;'>
                                                                    <p >Do you have specials if people invite a friend? Do you offer a summer special, Back to school promotion, New Year’s resolution or Spring Detox?</p>
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                            <tr><td height='16'></td></tr>
                                                            <tr>
                                                              <td>
                                                                <div class='contentEditableContainer contentTextEditable'>
                                                                  <div class='contentEditable'>
                                                                    <a target='_blank' class='link1' href="#" >Read more</a>
                                                                  </div>
                                                                </div>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                        <td width='20'></td>
                                                      </tr>
                        
                                                      <tr><td height='15' colspan='3'></td></tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                                
                                              </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                <tr><td height='20'> </td></tr>
                                              </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                <tr><td colspan='3' height='16'>&nbsp;</td></tr>
                                                <tr>
                                                  <td width='16' class="spechide">&nbsp;</td>
                                                  <td width="568" class="specbundle2">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' >
                                                      <tr>
                                                        <td align='left' valign='top'>
                                                          <div class="contentEditableContainer contentTextEditable" >
                                                           <div class="contentEditable" style='color:#555555;font-size:21px;font-weight:normal;'>
                                                            <h2 class='big'>Don’t forget to add a link to your website</h2>
                                                          </div>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                    <tr><td height='16'>&nbsp;</td></tr>
                                                    <tr>
                                                      <td align='left' valign='top'>
                                                        <div class="contentEditableContainer contentTextEditable" >
                                                         <div class="contentEditable" style='color:#999999;font-size:13px;line-height:19px;'>
                                                          <p >Use this space to give a bit of information about yourself. Don’t forget to add your logo, and links back to your website.</p>
                                                        </div>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                  <tr><td height='20'>&nbsp;</td></tr>
                                                  <tr>
                                                    <td align='right' valign='top' style='padding-bottom:8px;'>
                                                      <div class="contentEditableContainer contentTextEditable" >
                                                       <div class="contentEditable" >
                                                        <a target='_blank' class='link2' href="#" style='padding:8px;background:#62A9D2;font-size:13px;color:#ffffff;text-decoration:none;font-weight:bold;'>Find out more →</a>
                                                      </div>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                            <td width='16' class="spechide">&nbsp;</td>
                                          </tr>
                                          <tr><td colspan='3' height='16'>&nbsp;</td></tr>
                                        </table>
                                    </div>
                                    <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' class='bgBody' >
                                          <tr><td height='54' style='border-bottom:1px solid #DAE0E4'>&nbsp;</td></tr>
                        
                                          <tr><td height='28'></td></tr>
                        
                                          <tr>
                                            <td valign='top' align='center'>
                                              <div class="contentEditableContainer contentTextEditable">
                                                <div class="contentEditable" style='color:#A8B0B6; font-size:13px;line-height: 16px;'>
                                                  <p >This email was sent to [email] when you signed up on [CLIENTS.WEBSITE] Please add us to your contacts to ensure the newsletters land in your inbox.
                                                  </p>
                                                </div>
                                              </div>
                                              </td>
                                            </tr>
                        
                                            <tr><td height='28'></td></tr>
                        
                                            <tr>
                                              <td valign='top' align='center'>
                                                <div class="contentEditableContainer contentTextEditable">
                                                  <div class="contentEditable" style='color:#A8B0B6; font-weight:bold;font-size:13px;line-height: 30px;'>
                                                    <p >[CLIENTS.COMPANY_NAME]</p>
                                                  </div>
                                                </div>
                                                <div class="contentEditableContainer contentTextEditable">
                                                  <div class="contentEditable" style='color:#A8B0B6; font-size:13px;line-height: 15px;'>
                                                    <p >[CLIENTS.ADDRESS]</p>
                                                  </div>
                                                </div>
                                                <div class="contentEditableContainer contentTextEditable">
                                                  <div class="contentEditable" >
                                                    <a target='_blank' href="[FORWARD]" style='line-height: 20px;color:#A8B0B6; font-size:13px;'>Forward to a friend</a>
                                                  </div>
                                                </div>
                                                <div class="contentEditableContainer contentTextEditable">
                                                  <div class="contentEditable" >
                                                    <a target='_blank' href='[UNSUBSCRIBE]' style='line-height: 20px;color:#A8B0B6; font-size:13px;'>Unsubscribe</a>
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
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
                              <td height='130' bgcolor='#43474A'>&nbsp;</td>
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
                          resultado(null, { estado:"No enviado"});
                        }
                    
                        else { 
                          resultado(null, { estado:"ok"});
                          return;
                        }
                      });

                });
                
            } 
            
        } else{
            // Si el usuario si fue encontrado
            resultado(null, {estado:"no_permitido"});
            return
        }
      });
};

module.exports = Conferencia;