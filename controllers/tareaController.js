const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //Extraer el proyecto y comprobar si existe
    
    try {
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});


    } catch(error){
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas por proyecto

exports.obtenerTareas = async (req, res) => {
    try {
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado: 'desc'});
        res.json({tareas});

    } catch (error){

    }
}

//Actualizar una tarea

exports.actualizarTarea = async (req, res) => {
    try {
        const { proyecto, nombre, estado } = req.body;

        //Si la tarea existe o no
        let existeTarea = await Tarea.findById(req.params.id);
        
        if(!existeTarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Crear un objeto con la nueva información
        const nuevaTarea = {};
 
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado
      
        //Guardar la tarea
        existeTarea = await Tarea.findOneAndUpdate({_id: req.params.id}, {$set: nuevaTarea}, {new: true});
        res.json({tarea: existeTarea});

    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Elimina una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto } = req.query;
    
        //Si la tarea existe o no
        let existeTarea = await Tarea.findById(req.params.id);
        
        if(!existeTarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminar  
        await Tarea.findOneAndRemove({ _id: req.params.id});
        res.json({msg: 'Tarea eliminada'});

    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}