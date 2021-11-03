const express = require('express')
const mysql = require('mysql')
var cors = require('cors');
var bodyParser = require('body-parser');
const miconn = require('express-myconnection')
const routesPersonas = require('./routes/personas-routes')

/*const routes = require('./routes')*/

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.set('port', process.env.PORT || 9000)

// Parámetros a usar para la conexión con la base de datos.
const dbOpciones = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Admin123.',
    database: 'EduEvents'
}

// middlewares -------------------------------------
app.use(miconn(mysql, dbOpciones, 'single'))
app.use(express.json())


app.get('/',(req, res)=> {
    res.send('Bienvenido a EduEvents')
})

app.use('/registrate', routesPersonas)

// server running -----------------------------------
app.listen(app.get('port'), ()=>{
    console.log('server running on port', app.get('port'))
})

