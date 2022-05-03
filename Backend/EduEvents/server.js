const express = require("express");
const dotenv = require("dotenv")
const cors = require('cors');

const personaRoutes = require("./app/routes/persona.routes.js");
const loginRoutes = require("./app/routes/login.routes.js");
const eventoRoutes = require("./app/routes/evento.routes.js");
const conferenciaRoutes = require("./app/routes/conferencia.routes.js");
const inscripcionRoutes = require("./app/routes/inscripcion.routes.js");
const asistenciaRoutes = require("./app/routes/asistencia.routes.js");
const diplomaRoutes = require("./app/routes/diploma.routes.js");

const app = express();
app.use(cors())
app.use(express.json({limit: "500mb"}))



app.use(express.json())
dotenv.config()

// Routing 

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a EduEvents" });
});




personaRoutes(app)
loginRoutes(app)
eventoRoutes(app)
conferenciaRoutes(app)
inscripcionRoutes(app)
asistenciaRoutes(app)
diplomaRoutes(app)

const PORT = process.env.PORT || 4000

// set port, listen for requests
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto:  ${PORT}`);
  });

