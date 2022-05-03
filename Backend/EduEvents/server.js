const express = require("express");
const dotenv = require("dotenv")
const app = express();
// Acceso mediante cors para todos los clientes
const cors = require('cors');
dotenv.config()

app.use(express.json({limit: "500mb"}))

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENTE || 'https://edu-events.herokuapp.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json())


app.set('port', process.env.PORT || 4000)


// Hacemos un parse a json y definimos un limite
//app.use(express.json({limit: '50mb', extended: true,parameterLimit:50000}));


app.use(express.urlencoded({limit:"500mb", extended: true, parameterLimit:500000}));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); 

// Ruta raiz
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a EduEvents" });
});

require("./app/routes/persona.routes.js")(app);
require("./app/routes/login.routes.js")(app);
require("./app/routes/evento.routes.js")(app);
require("./app/routes/conferencia.routes.js")(app);
require("./app/routes/inscripcion.routes.js")(app);
require("./app/routes/asistencia.routes.js")(app);
require("./app/routes/diploma.routes.js")(app);


const PORT = process.env.PORT || 4000

// set port, listen for requests
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto:  ${PORT}`);
  });

