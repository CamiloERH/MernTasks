const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;
        await proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id});
        res.json({ proyectos });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

exports.actualizarProyecto = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //Extraer la información del proyecto
    const { nombre } = req.body;
    const nuevoProyecto =  {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisar el ID
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            //id no valido 
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        let proyecto = await Proyecto.findById(req.params.id);
        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id },
             {$set: nuevoProyecto}, { new: true});

        res.json({proyecto});

    } catch(error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
} 

//Elimina un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            //id no valido 
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
    
        let proyecto = await Proyecto.findById(req.params.id);
        //Si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //Verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id});
        await Tarea.deleteMany({proyecto: req.params.id});
        res.json({msg: 'Proyecto eliminado '});

    } catch(error) {
        res.status(500).send('Error en el servidor');
    }
    
}