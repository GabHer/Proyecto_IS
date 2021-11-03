const express = require('express')
const routes = express.Router()



// rutas-----------------------------------
//Obtener todas las personas
routes.get('/',(req, res)=> {
   
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM Persona', (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
})

//Crear una persona
routes.post('/',(req, res)=> {
    //Obtener todas las personas

    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('INSERT INTO Persona set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err)
            
            res.send('El Usuario se ha registrado')
        })
    })
    
})




module.exports = routes