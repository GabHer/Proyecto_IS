/*
 Definiremos el constructor para el Objeto Evento y usaremos la conexión de 
 la base de datos anterior para escribir funciones CRUD:
*/

const e = require("express");
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

Evento.obtenerEventos = (resultado) => {
  sql.query("SELECT * FROM Evento", (err, res) => {
      if(err) {
          resultado(null, err);
          return;
      }
      resultado(null, res);
  });
};


Evento.obtenerEventosUsuario = ( idUsuario, resultado ) => {
  let consulta = `SELECT * FROM Evento WHERE Id_Organizador = ${idUsuario};`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }

    for( let i = 0; i < res.length; i++){
      let buff = res[i].Caratula
      let srcImagen = buff.toString('ascii');
      res[i].Caratula = srcImagen;
    }  
    resultado( null, res);
  });
};



Evento.obtenerImagenesEvento = ( idEvento, resultado ) => {
  let consulta = `SELECT Imagenes_Evento.Id, Imagenes_Evento.Imagen FROM Evento JOIN Imagenes_Evento ON Evento.Id = Imagenes_Evento.Id_Evento WHERE Evento.Id = ${idEvento}`;

  var imagenes = {}
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }

      for( let i = 0; i < res.length; i++){
        let buff = res[i].Imagen
        let srcImagen = buff.toString('ascii');
        res[i].Imagen = srcImagen;
      }  

      var ImagenesDatos = []
      imagenes = res;
      for (var i=0; i<imagenes.length; i++ ){
        ImagenesDatos.push(imagenes[i].Imagen);
      };

      resultado( null, ImagenesDatos);

  });
};



Evento.obtenerEventos = ( resultado ) => {
  let consulta = `SELECT * FROM Evento;`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }

    for( let i = 0; i < res.length; i++){
      let buff = res[i].Caratula
      let srcImagen = buff.toString('ascii');
      res[i].Caratula = srcImagen;
    }  
    resultado( null, res);


  });
};


Evento.obtenerEventosEstado = ( estado, resultado ) => {
  let consulta = `SELECT * FROM Evento WHERE Estado_Evento = "${estado}";`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    };

      if(res.length){
        // Significa que encontró eventos en este estado.
        for( let i = 0; i < res.length; i++){
          let buff = res[i].Caratula
          let srcImagen = buff.toString('ascii');
          res[i].Caratula = srcImagen;
        }; 
        resultado(null, res);

        return;
    };

    // En ultima instancia, no se encontraron eventos en este estado
    resultado({ estado: "no_encontrado"}, null)
  });
};


//Obtener los evento por su estado para un usuario determinado.
Evento.obtenerEventosEstadoIdUsuario = ( parametros, resultado ) => {
  let consulta = `SELECT * FROM Evento WHERE Estado_Evento = "${parametros.estado}" AND Id_Organizador = ${parametros.idUsuario}`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    };


      if(res.length){
        // Significa que encontró eventos en este estado para este usuario.
        for( let i = 0; i < res.length; i++){
          let buff = res[i].Caratula
          let srcImagen = buff.toString('ascii');
          res[i].Caratula = srcImagen;
        }; 
        resultado(null, res);

        return;
    };

    // En ultima instancia, no se encontraron eventos en este estado para este usuario.
    resultado({ estado: "no_encontrado"}, null);
  });
};


Evento.obtenerEventoPorId = ( idEvento, resultado ) => {

  let consulta = `SELECT * FROM Evento WHERE Id = ${idEvento}`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }


      if(res.length){
        // Significa que encontró el evento con ese id.
        for( let i = 0; i < res.length; i++){
          let buff = res[i].Caratula
          let srcImagen = buff.toString('ascii');
          res[i].Caratula = srcImagen;
        } 


      
        Evento.obtenerImagenesEvento(idEvento, (err, data) => {    
          if (err) {
              resultado(err, null);
              return;
          }
           else {
            var eventoEncontrado = res;
            eventoEncontrado[0]["imagenes"] = data;
            resultado(null, eventoEncontrado);
            return;

          };
    });
  }
    else {
      // En ultima instancia, no se encontraró un evento con ese id.
      resultado({ estado: "no_encontrado"}, null);
    };
  });
};


Evento.obtenerEventosPorFecha = ( fechas, resultado ) => {
  let consulta = `SELECT * FROM Evento WHERE (Fecha_Inicio BETWEEN '${fechas.fechaInicio}' AND '${fechas.fechaFinal}') OR (Fecha_Final BETWEEN '${fechas.fechaInicio}' AND '${fechas.fechaFinal}')`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }


      if(res.length){
        // Significa que se encontraron eventos cuyas fechas de inicio y/o fechas de fin estan entre el rango de fechas proporcionado.
        for( let i = 0; i < res.length; i++){
          let buff = res[i].Caratula
          let srcImagen = buff.toString('ascii');
          res[i].Caratula = srcImagen;
        } 
        resultado(null, res);

        return;
    } 

    // En ultima instancia, no se encontraron eventos cuyas fechas de inicio y/o fechas de fin estan entre el rango de fechas proporcionado.
    resultado({ estado: "no_encontrado"}, null);
  });
};



Evento.obtenerEventosPorFechaYOrganizador = ( parametros, resultado ) => {
  let consulta = `SELECT * FROM Evento WHERE ((Fecha_Inicio BETWEEN '${parametros.fechaInicio}' AND '${parametros.fechaFinal}') OR (Fecha_Final BETWEEN '${parametros.fechaInicio}' AND '${parametros.fechaFinal}')) AND Id_Organizador = ${parametros.idOrganizador}`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }


      if(res.length){
        // Significa que se encontraron eventos cuyas fechas de inicio y/o fechas de fin estan entre el rango de fechas proporcionado para este usuario.
        for( let i = 0; i < res.length; i++){
          let buff = res[i].Caratula
          let srcImagen = buff.toString('ascii');
          res[i].Caratula = srcImagen;
        }; 
        resultado(null, res);

        return;
    } 

    // En ultima instancia, no se encontraron eventos cuyas fechas de inicio y/o fechas de fin estan entre el rango de fechas proporcionado para este usuario.
    resultado({ estado: "no_encontrado"}, null);
  });
};



Evento.eliminarEvento = ( idEvento, resultado ) => {
  let consulta = `DELETE FROM Evento WHERE Id = ${idEvento}`;
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }

    resultado( null, res );

  });
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
};


//Método para saber si la fecha que se recibe esta dentro de las fechas del evento.
Evento.confirmarFecha = ( parametros, resultado ) => {
  let consulta = `SELECT IF('${parametros.fecha}' BETWEEN Fecha_Inicio AND Fecha_Final, 'Si', 'No') AS Fecha_Valida FROM Evento WHERE Id = ${parametros.idEvento}`;
  console.log(consulta);
  sql.query( consulta, (err, res) => {
    if(err){
      resultado(err, null);
      return;
    }

    else {
      resultado( null, res);
    };
  });
};

// Obtener lista blanca de los eventos privados
Evento.obtenerListaBlancaPorIdEvento = (idEvento, resultado) => {
  let consulta = `SELECT * FROM lista_blanca WHERE Id_Evento = "${idEvento}";`;
  
  sql.query(consulta, (err, res) => {
    if(err) {
      resultado(err, null);
      return;
    };

    // Si existe lista blanca para ese evento
    if(res.length) {
      let buff = res[0].Lista_Blanca
      let srcListaBlanca = buff.toString('ascii');
      res[0].Lista_Blanca = srcListaBlanca;
      resultado(null, res);
      return;
    }
    else {
      // En ultima instancia, no se encontró lista blanca para ese evento
      resultado({estado: "no_encontrado"}, null);
    }
  });
};


module.exports = Evento;