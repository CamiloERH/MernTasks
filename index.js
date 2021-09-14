const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la base de datos
connectDB();

//habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({extended: true}));

const PORT = process.env.PORT || 4000; //puerto de la app

//Importar rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});