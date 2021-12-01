const { query } = require("express");
const sql = require("./db.js");
const transport = require("../models/enviarCorreo.js");
const Personas = require("../models/persona.model");
const Eventos = require("../models/evento.model");
const configCorreo = require("../config/envemail.config.js");
var fs = require('fs');

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
    this.Estado = objConferencia.Estado;
    this.Imagen = objConferencia.Imagen;
    this.Limite_Participantes = objConferencia.Limite_Participantes;
};

Conferencia.buscarPorNombre = ( datosConferencia , resultado ) => {
    sql.query(`SELECT * FROM Conferencia WHERE Id_Evento = ${datosConferencia.Id_Evento} AND Nombre = '${datosConferencia.Nombre}'`, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        }

        if(res.length){
            // Significa que se encontró otra conferencia creada con el mismo nombre dentro del mismo evento.
            resultado(null, res[0])
            return;
        }

        else {
            // En ultima instancia, no se encontró otra conferencia con ese nombre dentro del mismo evento.
            resultado({ estado: "no_encontrado"}, null)
        };
    });
};


Conferencia.crear = ( objConferencia, resultado ) => {
    Conferencia.buscarPorNombre(objConferencia, (err, data) => {

        var Tipo = objConferencia.Tipo == 1 ? "La Conferencia" : "El Taller";
        var Modalidad = objConferencia.Modalidad == 1 ? "Virtual" : "Presencial";  

        var datosBuscarFecha = {
            fecha : objConferencia.Fecha_Inicio,
            idEvento : objConferencia.Id_Evento
        }

        var img = objConferencia.Imagen;
        // strip off the data: url prefix to get just the base64-encoded bytes
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer.from(data, 'base64');
        fs.writeFile('../EduEvents/app/assets/img/banner.png', buf, err => {
            if (err) throw err;
        });

        if (err) {
           
            Eventos.confirmarFecha(datosBuscarFecha, (err, data) => {

                if(err) {
                    resultado(err, null);
                    return;
                };

                if (data[0].Fecha_Valida == "Si") {

                    // Si no se encuentra una conferencia existente con ese nombre dentro del mismo evento y la fecha está dentro del rango de fechas del evento.
                    consulta = `INSERT INTO Conferencia (Id_Evento, Tipo, Nombre, Descripcion, Modalidad, Medio, Correo_Encargado, Fecha_Inicio, Hora_Inicio, Hora_Final, Imagen, Limite_Participantes) VALUES (${objConferencia.Id_Evento},'${objConferencia.Tipo}','${objConferencia.Nombre}','${objConferencia.Descripcion}','${objConferencia.Modalidad}','${objConferencia.Medio}','${objConferencia.Correo_Encargado}','${objConferencia.Fecha_Inicio}','${objConferencia.Hora_Inicio}','${objConferencia.Hora_Final}','${objConferencia.Imagen}','${objConferencia.Limite_Participantes}');`
                    sql.query( consulta, (err, res) => {
                        if (err) {
                            resultado(err, null);
                            return;
                        }

                        else {
                            Personas.buscarDatosDeCorreo(objConferencia.Correo_Encargado, (err,data) => {

                                if (err) {
                                    resultado(err, null);
                                    return;
                                }
    
                                else {
                                    var consulta = `INSERT INTO Persona_Conferencia (Id_Persona, Id_Conferencia, Fecha_Inscripcion) VALUES (${data.Id}, (SELECT Conferencia.Id FROM Conferencia WHERE Conferencia.Nombre = '${objConferencia.Nombre}'), NOW())`;
    
                                    sql.query( consulta, (err, res) => {
                                        if (err) {
                                            resultado(err, null);
                                            return;
                                        }
    
                                        else {
                                            const message = {
                                                from: '"EduEvents" <edueventsmanagement@gmail.com>',
                                                to: objConferencia.Correo_Encargado,
                                                subject: "Encargado De Conferencia",
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
                                                                            <h2 style='font-size:32px;'>${data.Nombre_Completo}</h2>
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
                                                                            <p style = "margin-top:15px">Se te ha invitado a que seas encargado de <span> ${Tipo}</span><span style="font-weight:bolder"> "${objConferencia.Nombre}"</p>
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
                                                                                    <p ><span class="font">${objConferencia.Nombre}</p>
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
                                                                                            <p>${objConferencia.Descripcion}</p>
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
                                                                                            <p><span style="font-weight: bolder;">Fecha: </span>${objConferencia.Fecha_Inicio}</p>
                                                                                            <p><span style="font-weight: bolder;">Hora: </span><span>${objConferencia.Hora_Inicio}</span><span> - ${objConferencia.Hora_Final}</span></p>
                                                                                            <p><span style="font-weight: bolder;">Modalidad: </span><span>${Modalidad}</span></p>
                                                                                            <p><span style="font-weight: bolder;">Acceso: </span><span>${objConferencia.Medio}</span></p>
                                                                                            
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
                                                resultado(null, { estado:"No enviado"});
                                                return
                                                }
                                            
                                                else { 
                                                fs.unlinkSync('../EduEvents/app/assets/img/banner.png');
                                                resultado(null, { estado:"ok"});
                                                return;
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
                    resultado({ estado: "fecha_no_válida"}, null)
                };
            });
    
    }else{
        // Si el nombre de la conferencia está repetido.
        resultado(null, {estado:"no_permitido"});
        return;
    }
    });
};

// Obtener Conferencias de manera general
Conferencia.obtenerConferencias = (resultado) => {
    let consulta = `SELECT * FROM Conferencia;`;
    sql.query(consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };
        
        for(let i = 0; i < res.length; i++) {
            let buff = res[i].Imagen;
            let srcImagen = buff.toString('ascii');
            res[i].Imagen = srcImagen;
        };  
        resultado(null, res);
    });
};


// Obtener Conferencias de manera general
Conferencia.obtenerConferenciaPorId = (idConferencia, resultado) => {
    let consulta = `SELECT * FROM Conferencia WHERE Id = ${idConferencia};`;
    sql.query(consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };
        
        for(let i = 0; i < res.length; i++) {
            let buff = res[i].Imagen;
            let srcImagen = buff.toString('ascii');
            res[i].Imagen = srcImagen;
        };  
        
        resultado(null, res);
    });
};


// Obtener las conferencias por Id de Evento
Conferencia.obtenerConferenciasPorIdEvento = (idEvento, resultado) => {
    let consulta = `SELECT * FROM Conferencia WHERE Id_Evento = ${idEvento};`;
    sql.query(consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };

        //Si existen conferencias creadas para ese evento
        if(res.length) {
            for(let i = 0; i < res.length; i++) {
                let buff = res[i].Imagen
                let srcImagen = buff.toString('ascii');
                res[i].Imagen = srcImagen;
            };
            resultado(null, res);
        }

        else {
        // En ultima instancia, no se encontraron conferencias para ese evento
        resultado({estado: "no_encontrado"}, null);
        };
    });
};

// Obtener las conferencias por Id de Usuario
Conferencia.obtenerConferenciasPorIdUsuario = (idUsuario, resultado) => {
    let consulta = `SELECT * FROM Conferencia JOIN Persona_Conferencia
        ON Conferencia.Id = Persona_Conferencia.Id_Conferencia
        WHERE Persona_Conferencia.Id_Persona = "${idUsuario}";`;

    sql.query(consulta, (err, res) => {
        if(err) {
            resultado(err, null);
            return;
        };
    
        // Si el usuario se ha inscrito a conferencias 
        if(res.length) {
            for(let i = 0; i < res.length; i++){
                let buff = res[i].Imagen
                let srcImagen = buff.toString('ascii');
                res[i].Imagen = srcImagen;
            }; 
            resultado(null, res);
            return;
        }

        else {
            // En ultima instancia, no se encontraron conferencias para ese usuario
            resultado({estado: "no_encontrado"}, null);
        };
    
    });
};


//Eliminar Conferencias
Conferencia.eliminarConferencias = ( idConferencia, resultado ) => {
    let consulta = `DELETE FROM Conferencia WHERE Id = ${idConferencia}`;
    sql.query( consulta, (err, res) => {
      if(err){
        resultado(err, null);
        return;
      }
      resultado( null, res );
    });
};

// Obtener Participantes inscritos a una Conferencia
Conferencia.obtenerParticipantesPorIdConferencia = (idConferencia, resultado) => {
    let consulta = `SELECT persona.Nombre, persona.Apellido, persona.Fotografia FROM persona JOIN persona_conferencia
        ON persona.Id = persona_conferencia.Id_Persona JOIN conferencia
        ON conferencia.Id = persona_conferencia.Id_Conferencia
        WHERE persona.Correo <> conferencia.Correo_Encargado AND persona_conferencia.Id_Conferencia = "${idConferencia}";`;
    
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

module.exports = Conferencia;



