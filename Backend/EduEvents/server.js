const express = require("express");

const app = express();
app.set('port', process.env.PORT || 8888)

// Acceso mediante cors para todos los clientes
const cors = require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

// Hacemos un parse a json y definimos un limite
//app.use(express.json({limit: '50mb', extended: true,parameterLimit:50000}));

app.use(express.json({limit: "500mb"}))
app.use(express.urlencoded({limit:"500mb", extended: true, parameterLimit:500000}));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); 

// Ruta raiz
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a EduEvents" });
});

require("./app/routes/persona.routes.js")(app);
require("./app/routes/login.routes.js")(app);

// set port, listen for requests
app.listen(8888, () => {
    console.log("El servidor esta corriendo en el puerto 8888.");
  });

