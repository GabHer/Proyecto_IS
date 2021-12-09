const sql = require("./db.js");
const Personas = require("../models/persona.model");
const Conferencias = require("../models/conferencia.model");
const transport = require("../models/enviarCorreo.js");
const configCorreo = require("../config/envemail.config.js");
var fs = require('fs');

// constructor del objeto inscripcion
const Inscripcion = function(objPersona) {
    this.idPersona = objPersona.IdPersona;
    this.idConferencia = objPersona.idConferencia;
    this.fechaInscripcion = "";    
};


Inscripcion.validarInscripcion = (objNuevaInscripcion, resultado ) => {
    
    let consulta = `SELECT (IF (( SELECT (COUNT(*)<Conferencia.Limite_Participantes+1 OR COUNT(*) = 0) FROM Conferencia JOIN Persona_Conferencia ON Conferencia.Id=Persona_Conferencia.Id_Conferencia WHERE Id_Conferencia = ${objNuevaInscripcion.idConferencia}), 'Si', 'No')) AS cupoValido, (IF ((SELECT Estado_Conferencia = "Inactivo" FROM Conferencia WHERE Id = ${objNuevaInscripcion.idConferencia}), 'Si', 'No')) AS estadoValido , (IF ((SELECT COUNT(*)=0 FROM Conferencia JOIN Persona_Conferencia ON Conferencia.Id = Persona_Conferencia.Id_Conferencia WHERE Persona_Conferencia.Id_Persona = ${objNuevaInscripcion.idPersona} AND Conferencia.Fecha_Inicio = (SELECT Conferencia.Fecha_Inicio FROM Conferencia WHERE Id = ${objNuevaInscripcion.idConferencia}) AND (SELECT Conferencia.Hora_Inicio FROM Conferencia WHERE Id = ${objNuevaInscripcion.idConferencia}) BETWEEN Conferencia.Hora_Inicio AND Conferencia.Hora_Final), 'Si', 'No')) AS horaYFechaValida;`;

    sql.query( consulta, (err, res) => {
      if(err){
        resultado(err, null);
        return;
      }

      else {
        resultado(null, res);
        return;
      };
    });
};


Inscripcion.crearInscripcion = ( objNuevaInscripcion, resultado ) => {
    Inscripcion.validarInscripcion(objNuevaInscripcion, (err, data) => {    
        if (err) {
            resultado(err, null);
            return;
        }
        
        if ((data[0].cupoValido == "Si") && (data[0].estadoValido == "Si") && (data[0].horaYFechaValida == "Si")) {


            consulta = `INSERT INTO Persona_Conferencia (Id_Persona, id_Conferencia, Fecha_Inscripcion) VALUES (${objNuevaInscripcion.idPersona},'${objNuevaInscripcion.idConferencia}', NOW());`
                    sql.query( consulta, (err, res) => {
                        if (err) {
                            resultado(err, null);
                            return;
                        }

                        else {

                            Personas.buscarDatosDeId(objNuevaInscripcion.idPersona, (err,data) => {

                                var nombreCompleto = data.Nombre_Completo;
                                var correo = data.Correo;

                                if (err) {
                                    resultado(err, null);
                                    return;
                                }
                                
                                else {

                                    Conferencias.obtenerConferenciaPorId(objNuevaInscripcion.idConferencia, (err,data) => {


                                        var Tipo = data[0].Tipo == 1 ? "La Conferencia" : "El Taller";

                                        var Modalidad = data[0].Modalidad == 1 ? "Virtual" : "Presencial";  
        
        
                                        var img = data[0].Imagen;
                                        // strip off the data: url prefix to get just the base64-encoded bytes
                                        var imgData = img.replace(/^data:image\/\w+;base64,/, "");
                                        var buf = new Buffer.from(imgData, 'base64');
                                        fs.writeFile('../EduEvents/app/assets/img/banner.png', buf, err => {
                                            if (err) throw err;
                                        });
        

                                        if (err) {
                                            resultado(err, null);
                                            return;
                                        }

                                        else {

                                            
                                            const message = {
                                                from: '"EduEvents" <edueventsmanagement@gmail.com>',
                                                to: correo,
                                                subject: "Inscripción a Conferencia",
                                                attachments: [
                                                {
                                                    filename: 'Logo.png',
                                                    path: '../EduEvents/app/assets/img/Logo.png',
                                                    cid: 'logo' 
                                                },
                                                {
                                                    filename: 'EduEvents.png',
                                                    path: '../EduEvents/app/assets/img/EduEvents.png',
                                                    cid: 'EduEvents' 
                                                },
                                                {
                                                    filename: "banner.png",
                                                    path: '../EduEvents/app/assets/img/banner.png',
                                                    cid: 'Banner' 
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
                                                                        <div class='contentEditableContainer contentTextEditable'>
                                                                            <div class="contentEditable" style='font-size:32px;color:#555555;font-weight:normal;'>
                                                                            <h2 style='font-size:32px;'>${nombreCompleto}</h2>
                                                                            </div>
                                                                        </div>
                                                                        </td>
                                                                        <td  width='70'></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td width='70'></td>
                                                                        <td  align='center' width='530'>
                                                                        <div class='contentEditableContainer contentTextEditable'>
                                                                            <div class="contentEditable" style='font-size:13px;color:black;line-height:19px;'>
                                                                            <p style = "margin-top:15px">Te has inscrito a <span> ${Tipo}</span><span style="font-weight:bolder"> "${data[0].Nombre}"</p>
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
                                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                        <tr>
                                                                        <td>
                                                                            <div class='contentEditableContainer contentImageEditable'>
                                                                            <div class="contentEditable">
                                                                                <img class="banner" src="cid:Banner" alt='What we do' data-default="placeholder" data-max-width="600" width='600' height='180' >
                                                                            </div>
                                                                            </div>
                                                                        </td>
                                                                        </tr>
                                                                        <tr><td height='10' bgcolor='#4484CE'></td></tr>
                                                                        <tr>
                                                                        <td bgcolor='#4484CE' style='padding:8px 0;'>
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
                                                                                    <p ><span class="font">${data[0].Nombre}</p>
                                                                                    </div>
                                                                                </div>
                                                                                </td>
                                                                                <td width='20' class="specbundle2"></td>
                                                                                <td class="specbundle2" align='center' valign='middle' width='180'>
                                                                                <div class='contentEditableContainer contentTextEditable'>
                                                                                    
                                            
                                            
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
                                                                        <tr><td height='10' bgcolor='#4484CE'></td></tr>
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
                                                                                            <h2 class='big' >Descripción</h2>
                                                                                        </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    </tr>
                                                                                    <tr><td height='16'></td></tr>
                                                                                    <tr>
                                                                                    <td>
                                                                                        <div class='contentEditableContainer contentTextEditable'>
                                                                                        <div class='contentEditable' style='color:#999999;font-size:13px;line-height:19px;'>
                                                                                            <p>${data[0].Descripcion}</p>
                                                                                        </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    </tr>
                                                                                    <tr><td height='16'></td></tr>
                                                                                    <tr>
                                                                                    <td>
                                                                                        <div class='contentEditableContainer contentTextEditable'>
                                                                                        <div class='contentEditable'>
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
                                                                                        <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top'>
                                                                                            <tr><td height='10' bgcolor='#D98F45'></td></tr>
                                                                                                <tr>
                                                                                                <td>
                                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" valign='top' bgcolor='#D98F45'>
                                                                                                    <tr>
                                                                                                        <td width='25'></td>
                                                                                                        <td width='475' valign='middle'>
                                                                                                        <div class='contentEditableContainer contentTextEditable'>
                                                                                                            <div class="contentEditable" style='text-align: center;font-family:Georgia;font-style:italic;color:#0F4666;font-size:15px;line-height:19px;'>
                                                                                                            <p style='color:#0F4666;'>Detalles de la Conferencia</p>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        </td>
                                                                                                        <td width='45' valign='top'>
                                                                                                        <div class='contentEditableContainer contentFacebookEditable'>
                                                                                                            <div class="contentEditable">
                                                                                                            
                                            
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        </td>
                                                                                                        <td width='10'></td>
                                                                                                        <td width='45' valign='top'>
                                                                                                        <div class='contentEditableContainer contentTwitterEditable'>
                                                                                                            <div class="contentEditable">
                                                                                                            
                                            
                                            
                                                                                                            </div>
                                                                                                        </div>  
                                                                                                        </td>
                                                                                                        <td width='10'></td>
                                                                                                    </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                                </tr>
                                                                                                <tr><td height='10' bgcolor='#D98F45'></td></tr>
                                                                                            </table>
                                                                                        </div>
                                                                                    </td>
                                                                                    </tr>
                                                                                    <tr><td height='16'></td></tr>
                                                                                    <tr>
                                                                                    <td>
                                                                                        <div class='contentEditableContainer contentTextEditable'>
                                                                                        <div class='contentEditable' style='color:#999999;font-size:13px;line-height:19px;'>
                                                                                            <p><span style="font-weight: bolder;">Fecha: </span>${data[0].Fecha_Inicio}</p>
                                                                                            <p><span style="font-weight: bolder;">Hora: </span><span>${data[0].Hora_Inicio}</span><span> - ${data[0].Hora_Final}</span></p>
                                                                                            <p><span style="font-weight: bolder;">Modalidad: </span><span>${Modalidad}</span></p>
                                                                                            <p><span style="font-weight: bolder;">Acceso: </span><span>${data[0].Medio}</span></p>
                                                                                            
                                                                                        </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    </tr>
                                                                                </table>
                                                                                </td>
                                                                                <td width='20'></td>
                                                                            </tr>
                                                                            </table>
                                                                        </td>
                                                                        </tr> 
                                                                        <tr><td height='20'></td></tr>
                                                                        <tr><td height='20'></td></tr>
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
                                                    console.log("Este es el error =>>>>>", err)
                                                resultado(null, { estado:"No_enviado"});
                                                return;
                                                }
                                            
                                                else { 
                                                fs.unlinkSync('../EduEvents/app/assets/img/banner.png');
                                                resultado(null, { estado:"ok"});
                                                return;
                                                };
                                            });



                                        }

                                    });
                                };
                            });
                        };
  
                    });
                }

                if ((data[0].cupoValido == "No") && (data[0].estadoValido == "Si") && (data[0].horaYFechaValida == "Si")) {

                    resultado(null, { estado:"limite_alcanzado"});
                    return;

                }

                if ((data[0].cupoValido == "Si") && (data[0].estadoValido == "No") && (data[0].horaYFechaValida == "Si")) {

                    resultado(null, { estado:"estado_no_valido"});
                    return;
                    
                }

                if ((data[0].cupoValido == "Si") && (data[0].estadoValido == "Si") && (data[0].horaYFechaValida == "No")) {

                    resultado(null, { estado:"traslape"});
                    return;
                    
                }

                if ((data[0].cupoValido == "Si") && (data[0].estadoValido == "Si") && (data[0].horaYFechaValida == "Si")) {

                    resultado(null, { estado:"ok"});
                    return;
                    
                }

                else {
                    resultado(null, { estado: "no_permitido"});
                    return;
                };
    });
};

Inscripcion.obtenerInscritosPorIdConferencia = (idConferencia, resultado) => {
    let consulta = `SELECT Persona.Id, Persona.Nombre, Persona.Apellido, Persona.Institucion, 
        Persona.Formacion_Academica, Persona.Descripcion, Persona.Intereses, Persona.Fecha_Nacimiento, 
        Persona.Fotografia, Persona.Correo, Persona.Contrasena, Persona.Firma 
        FROM Persona JOIN Persona_Conferencia
        ON Persona.Id = Persona_Conferencia.Id_Persona JOIN Conferencia
        ON Conferencia.Id = Persona_Conferencia.Id_Conferencia
        WHERE Persona.Correo <> Conferencia.Correo_Encargado AND Persona_Conferencia.Id_Conferencia = ${idConferencia};`;


    console.log("La consulta es =>>>")
    console.log(consulta)

    sql.query(consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };

        // Si hay usuarios inscritos a la conferencia 
        if(res.length) {
            for(let i = 0; i < res.length; i++){
                let buff = res[i].Fotografia
                let srcImagen = buff.toString('ascii');
                res[i].Fotografia = srcImagen;
            }; 
            resultado(null, res);
            return;
        }
        else {
            // En ultima instancia, no se encontraron usuarios inscritos a la conferencia
            resultado({estado: "no_encontrado"}, null);
        }
    });
};

// Eliminar inscripción a una determinada conferencia
Inscripcion.eliminarInscripcion = (datosInscripcion, resultado ) => {
    let consultaVerificarEstadoConferencia = `SELECT Id FROM Conferencia WHERE Id = ${datosInscripcion.idConferencia} AND Estado_Conferencia = 'Finalizado';`;
    
    let consultaEliminar = `DELETE FROM Persona_Conferencia WHERE Id_Persona = ${datosInscripcion.idPersona} AND Id_Conferencia = ${datosInscripcion.idConferencia};`;
    
    sql.query(consultaVerificarEstadoConferencia, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };
        
        // De lo contrario
        if(res.length) {
            // Significa que la conferencia ya finalizó y no se puede eliminar la inscripción
            resultado({estado: "no_encontrado"}, null);
            return;
        }  
        // En última instancia, se puede eliminar la inscripción
        else {
            sql.query(consultaEliminar, (err, res) => {
                if(err) {
                    resultado(err, null);
                    return;
                };
                resultado(null, res);
            });
        };
    });
};

module.exports = Inscripcion;


