const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    registro: {
        type: Date,
        default: Date.now()
    }
});

//El tercer nombre es el nombre de la coleccion si no se le pasa nada usa el nombre usuario y le agrega una s
module.exports = mongoose.model('Usuario', UsuarioSchema);