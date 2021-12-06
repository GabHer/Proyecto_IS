module.exports = app => {
    const inscripciones = require("../controllers/inscripcion.controller.js");

    //Método para inscribir a un usuario en una determinada conferencia.
    app.post("/inscripcion/NuevaInscripcion", inscripciones.crearNuevaInscripcion);

    // Obtener los participantes inscritos a una conferencia
    app.get("/inscripcion/obtenerInscripcionesPorIdConferencia/:idConferencia", inscripciones.obtenerInscritosIdConferencia);

    // Eliminar inscripción a una conferencia
    app.delete('/inscripcion/eliminarInscripcion/:idPersona/:idConferencia', inscripciones.eliminarInscripcion);

};
