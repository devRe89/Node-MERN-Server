const mongoose = require('mongoose');
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


exports.crearTareas = async (req, res) => {

    //Validar errores en los campos 
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()});
    }

    try {
        const { proyecto } = req.body;
        const proyectoinfo = await Proyecto.findById(proyecto);


        if (!proyectoinfo){
            return res.status(400).json({msg : "No existe proyecto"});
        }

        if (proyectoinfo.creador.toString() !== req.usuario.id){
            return res.status(404).json({ msg: "No Autorizado"});
        }

        const tarea = new Tarea(req.body);
        tarea.proyecto = proyectoinfo._id;
        tarea.save();
        res.json(tarea);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"});
    }

}

exports.getTareasByProyecto = async (req, res) => {
    
    try {

        const proyecto_id = req.params.id;
        const proyectoinfo = await Proyecto.findById(proyecto_id);
        if (!proyectoinfo) {
            return res.status(404).json({msg: "No existe proyecto"});
        }

        if (proyectoinfo.creador.toString() !== req.usuario.id){
            return res.status(404).json({ msg: "No Autorizado"});
        }

        const tareas = await Tarea.find({proyecto : proyecto_id});
        if (!tareas) {
            return res.status(404).json({msg: "No hay tareas, Favor crea una"});
        }
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"});
    }
}

exports.actualizaEstadoTarea = async (req, res) => {
    try {
        const {proyecto, nombre, estado} = req.body;
        const tarea_id = req.params.id;
        
        const proyectoinfo = await Proyecto.findById(proyecto);
        
        if (proyectoinfo.creador.toString() !== req.usuario.id){
            return res.status(404).json({ msg: "No Autorizado"});
        }
        let tarea = await Tarea.findById(tarea_id);
        if(!tarea) {
            return res.status(404).json({msg: "La tarea no existe"});
        }
        const nuevaTarea = {};
        if (nombre){
            nuevaTarea.nombre = nombre;
        }

        if (estado !== 'undefined'){
            nuevaTarea.estado = Boolean(estado);
        }
        tarea = await Tarea.findOneAndUpdate({ _id: tarea_id},  nuevaTarea, { new:true });
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Hubo un error"});
    }
}

exports.eliminarTarea = async (req, res) => {

    try {
        //Obtener id de tarea
        const tarea_id = req.params.id;
    
        //Validar si estoy autorizado
        const {proyecto} = req.query;
        console.log(proyecto);
        const proeyectoInfo = await Proyecto.findById(proyecto);
        if (proeyectoInfo.creador.toString() !== req.usuario.id){
            return res.status(404).json({ msg: "No Autorizado"});
        }
    
        //Validar que exista tarea
        const tarea = await Tarea.findById(tarea_id);
        if(!tarea) {
            return res.status(404).json({msg: "La tarea no existe"});
        }
    
        // Elimnar la tarea
        await Tarea.findByIdAndRemove({ _id: tarea_id });
        res.json({ msg: "La tarea a sido eliminada"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "HUbo un error"});
    }
}