const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
// Crear Servidor 
const app = express();

// Conectar a la db
conectarDB();

//Cors
app.use(cors());

//Hbilitar express.js
app.use(express.json({ extended: true }));

//Puerto conexión app
const PORT = process.env.PORT || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// start app
app.listen(PORT, () =>{
    console.log(`servidor funcionando en el puerto ${PORT}`);
});