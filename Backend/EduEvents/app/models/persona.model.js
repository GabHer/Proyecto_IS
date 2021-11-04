/*
 Definiremos el constructor para el Objeto Persona,aquí y usaremos la conexión de 
 la base de datos anterior para escribir funciones CRUD:
*/

const sql = require("./db.js");

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
            if (err.estado === "no_encontrado") {
                sql.query("INSERT INTO Persona SET ?", nuevoObjetoPersona, (err, res) => {
                    if (err) {
                        console.log(err);
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
}

Persona.actualizar = ( correoPersona, resultado ) => {

}

Persona.eliminar = ( correoPersona, resultado ) => {

}


Persona.buscarPorCorreo = ( correoPersona, resultado ) => {
    sql.query(`SELECT * FROM Persona WHERE correo = '${correoPersona}'`, (err, res) => {
        if (err){
            console.log("error: ", err);
            resultado(err, null);
            return;
        }

        if(res.length){
            // Significa que encontro un usuario registrado con este correo
            resultado(null, res[0])
            return;
        }

        // En ultima instancia, no se encontro el usuario con ese correo

        resultado({ estado: "no_encontrado"}, null)

    })
}

Persona.obtenerPersonas = ( resultado ) => {
    sql.query("SELECT * FROM Persona", (err, res) => {
        if (err) {

          resultado(null, err);
          return;
        }
    
        console.log("Personas: ", res);
        resultado(null, res);
      });
};



module.exports = Persona;