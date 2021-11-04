const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Creando la conexión con la base de datos
const coneccion = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// open the MySQL connection
coneccion.connect(error => {
    if (error) throw error;
    console.log("La conexión con la base de datos fue exitosa");
  });
  
  module.exports = coneccion;