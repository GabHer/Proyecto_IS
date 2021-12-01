const Inscripcion = require("../models/inscripcion.model");


// Validar que es posible inscribir al usuario en la conferencia. Condiciones: El estado de la conferencia deber ser: Inactivo, no se debe haber alcanzado el máximo permitido de participantes inscritos, y que la personas a inscribirse no sea ni encargado ni asistente a otra conferencia que sea a la misma hora y el mismo dia a la que intenta inscribirse.

exports.validarNuevaInscripcion = (req, res) => {
    Inscripcion.validarInscripcion(req.params, (err, data) => {
        if (err)
          res.status(500).send({
            mensaje: "Se produjo un error al intentar validar la inscripción de este usuario a dicha conferencia."
          });
        else 
        {
          res.send(data);
        }
      });
};

exports.crearNuevaInscripcion = (req, res) => {
    Inscripcion.crearInscripcion(req.body, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({
            mensaje: err + "Se produjo un error al intentar inscribir este usuario en dicha conferencia."
            });
        }
        else{
            if(data.estado == 'limite_alcanzado'){
              res.send({mensaje: 'Se ha alcanzado el limite de participantes suscritos para esta conferencia', codigo:400, estado:'limite_alcanzado'})
              return;
            }
            if(data.estado == 'estado_no_valido'){
                res.status(400).send({mensaje: 'Suscripción no permitida, puesto que la conferencia ha dado inicio o ha finalizado.', codigo:400, estado:'estado_no_valido'})
                return;
            }
            if(data.estado == 'traslape'){
                res.status(400).send({mensaje: 'El usuario está inscrito en otra conferencia el mismo día y hora.', codigo:400, estado:'traslape'})
                return;
            }
            if(data.estado == 'no_permitido'){
                res.status(400).send({mensaje: 'Una o más condiciones no permiten la suscripción.', codigo: 400, estado: "no_permitido"})
                return;
            }
            else{
              res.status(200).send( {mensaje: 'Inscripción exitosa', codigo:200, estado:'ok'} )
              return;
            }
          }
      });
};
