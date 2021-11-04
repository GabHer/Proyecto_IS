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

// Obtener por correo
routes.get('/:correo', (req, res)=> {
    
    const {correo} = req.params;
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query(`SELECT * FROM Persona WHERE Correo = '${correo}'`, (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
})



//Crear una persona y guardarla en la base de datos
routes.post('/', (req, res)=> {
    // Buscar un usuario con el correo con el que intenta registrarse
    req.getConnection((err, conn)=>{

        if(err) return res.send({mensaje:"No se pudo conectar con la base de datos.", err})

        conn.query(`SELECT * FROM Persona WHERE correo = '${req.body.Correo}'`, (err, result) => {
            if (err){
                res.send(err)
                return;
            }

            if(result.length){
                // Significa que encontro un usuario registrado con este correo
                res.send({mensaje:"correo en uso", codigo:406, estado:'error'})
                return;
            }else{
                // De lo contrario hace el insert
                conn.query('INSERT INTO Persona (Nombre, Apellido, Institucion, Formacion_Academica, Descripcion, Intereses, Fecha_Nacimiento, Fotografia, Correo, Contrasena) VALUES (?,?,?,?,?,?,?,?,?,AES_ENCRYPT(?,?))', [req.body.Nombre, req.body.Apellido, req.body.Institucion, req.body.Formacion_Academica, req.body.Descripcion, req.body.Intereses, req.body.Fecha_Nacimiento, req.body.Fotografia, req.body.Correo, req.body.Contrasena, req.body.Contrasena], (err, rows)=>{

                    if(err) return res.send(err)
                    
                    res.send({mensaje: 'El Usuario se ha registrado', codigo:200, estado: 'ok'})
                })
            }

        })
        
        
    })
})





module.exports = routes