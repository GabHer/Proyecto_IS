module.exports = app => {
    const loging = require("../controllers/loging.controller.js");

    // Nuevo loging
    app.post("/loging", loging.iniciarSesion);
  

  

  };