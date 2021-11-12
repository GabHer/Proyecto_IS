/*
 Definiremos el constructor para el Objeto resetToken,aquí y usaremos la conexión de 
 la base de datos anterior para escribir funciones CRUD:
*/

const sql = require("./db.js");

// constructor del objeto resetToken
const ResetToken = function (objResetToken) {
    this.Correo = objResetToken.Correo;
    this.Token = objResetToken.Token;
    this.Vencimiento = null;
    this.Creado = null;
    this.Actualizado = null;
    this.Usado = 0;
};



ResetToken.crear = ( nuevoResetToken, resultado ) => {

    consulta = `INSERT INTO reset_token (Correo, Token, Vencimiento, Creado, Actualizado) VALUES ('${nuevoResetToken.Correo}','${nuevoResetToken.Token}', DATE_ADD(NOW(), INTERVAL 1 HOUR), NOW(), NOW())`;

    sql.query(consulta, (err, res) => {
        if (err) {
            resultado(err, null);
            return;
        }
        else {
            resultado(null, { estado:"ok"});
            return;
        };
    }); 
};


ResetToken.actualizarPorCorreo = ( correoPersona, resultado ) => {
    consulta = `UPDATE reset_token SET Usado = 1, Actualizado = now() WHERE Correo = '${correoPersona}'`;
    
    sql.query( consulta, (err) => {
        if (err) {
            resultado(err, null);
            return;
        };
        
        resultado(null, { estado:"ok"});
        return;
    });
};


ResetToken.encontrarToken = ( objResetToken, resultado ) => {
    consulta = `SELECT * FROM reset_token WHERE Correo = '${objResetToken.Correo}' AND Token = '${objResetToken.Token}' AND now() < Vencimiento AND Usado = 0`;

    sql.query( consulta, (err, res) => {
        if (err){
            console.log("error: ", err);
            resultado(err, null);
            return;
        }

        if(res.length){
            resultado(null, {estado: "ok"})
            return;
        }

        // En ultima instancia, no se encontró token para este usuario.
        else {
            resultado({ estado: "No encontrado"}, null);
        }
       
    });
};


ResetToken.borrarTokens = (peticion, resultado) => {
    consulta = `DELETE FROM reset_token WHERE now() > Vencimiento`;

    sql.query( consulta, (err) => {
        if (err) {
            console.log(err);
            resultado(err, null);
            return;
        };
        
        resultado(null, { estado:"ok"});
        return;
    });
};

module.exports = ResetToken;
