/*
 Definiremos el constructor para el Objeto Evento y usaremos la conexión de 
 la base de datos anterior para escribir funciones CRUD:
*/

const sql = require("./db");

// Constructor del objeto Evento
const Evento = function(objEvento) {
    this.Nombre = objEvento.Nombre;
    this.Institucion = objEvento.Institucion;
    this.Descripcion = objEvento.Descripcion;
    this.Fecha_Inicio = objEvento.Fecha_Inicio;
    this.Fecha_Final = objEvento.Fecha_Final;
    this.Estado_Participantes = objEvento.Estado_Participantes;
    this.Estado_Evento = objEvento.Estado_Evento;
    this.Id_Organizador = objEvento.Id_Organizador;
    this.Lista_Blanca = objEvento.Lista_Blanca;
    this.Imagenes_Evento = objEvento.Imagenes_Evento;
    this.Caratula = objEvento.Caratula;
    
};


Evento.crear = (nuevoObjetoEvento, resultado) => {

    // Verificar que no existan eventos con el mismo nombre

    var consultaNombre = `SELECT Nombre FROM Evento WHERE Nombre = '${nuevoObjetoEvento.Nombre}';`;
    sql.query(consultaNombre, (err, res) => {
      if(err){
        // Si ocurre un error con la consulta
        resultado(err, null);
        return;
      }else {

        
        if(res.length){
          // Si encontramos que hay eventos con el mismo nombre
          resultado(null, {mensaje: 'El nombre de ese evento ya esta en uso', codigo:500, estado:"no_permitido"});
          return;
        }else{
          // Se hace el insert

          var consultaEvento = `CALL SP_Crear_Evento ('${nuevoObjetoEvento.Caratula}','${nuevoObjetoEvento.Nombre}','${nuevoObjetoEvento.Institucion}','${nuevoObjetoEvento.Descripcion}','${nuevoObjetoEvento.Fecha_Inicio}','${nuevoObjetoEvento.Fecha_Final}','${nuevoObjetoEvento.Estado_Participantes}', '${nuevoObjetoEvento.Estado_Evento}',${nuevoObjetoEvento.Id_Organizador}, '${nuevoObjetoEvento.Lista_Blanca}');`
          sql.query(consultaEvento,  (err, res) => {
      
            if(err){
              resultado(err, null)
            } else {
      
      
      
              for( let i = 0; i < nuevoObjetoEvento.Imagenes_Evento.length; i++){
                let imagen = nuevoObjetoEvento.Imagenes_Evento[i].blob;
                var consultaListaImagenes = `INSERT INTO Imagenes_Evento (Id_Evento, Imagen) VALUES (
                  (SELECT MAX(Id) FROM Evento), '${imagen}'
                );`
                sql.query( consultaListaImagenes, (error, respuesta) => {
                  if(error){
                    resultado(err, null);
                    return
                  }
                  
                })
              }
              resultado(null, res)
            }
          })
        }
      }
    })


    
  
}

Evento.actualizar = (parametros, resultado) => {

};

Evento.eliminar = (nombreEvento, resultado) => {

};

Evento.obtenerEventos = (resultado) => {
    sql.query("SELECT * FROM Evento", (err, res) => {
        if(err) {
            resultado(null, err);
            return;
        }
        resultado(null, res);
    });
};

module.exports = Evento;