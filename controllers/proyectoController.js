const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyectos = async (req, res) => {
    //Validar errores en los campos 
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()});
    }

    try {
        const proyecto = new Proyecto(req.body);
    
        //Guardar id Usuario via JWT
        proyecto.creador = req.usuario.id;
    
        proyecto.save();
    
        res.json(proyecto);
    } catch (error) {
    
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtener listado de proyectos de un usuario
exports.getProyectosById = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador : req.usuario.id}).sort({ creador: -1 });
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar un proyecto via ID.
exports.actualizaProyecto = async (req, res) => {
    
    //Validar errores en los campos 
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array()});
    }

    const {nombre} = req.body;

    const nuevoProyecto = {}

    if (nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        let proyecto = await Proyecto.findById(req.params.id);

        if (!proyecto){
            return res.status(404).json({msg: "Proyecto no existe"});
        }
        
        if (proyecto.creador.toString() !== req.usuario.id){
            return res.status(404).json({ msg: "No Autorizado"});
        }

        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarProyecto = async (req, res) => {
    try {
        let proyecto = await Proyecto.findById(req.params.id);

        if (!proyecto) {
            return res.status(400).json({ msg: "No existe Proyecto"});
        }

        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(400).json({ msg: "No esta autorizado"});
        }

        await Proyecto.findByIdAndRemove({ _id : req.params.id });
        res.json({msg: "Proyecto eliminado" });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}