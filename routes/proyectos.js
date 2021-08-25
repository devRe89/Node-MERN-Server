const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');



router.post('/', 
    auth,
    [
        check('nombre', 'EL nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyectos    
);

router.get('/', 
    auth,
    proyectoController.getProyectosById    
);

router.put('/:id',
    auth,
    [
        check('nombre', 'EL nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizaProyecto
);

router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;