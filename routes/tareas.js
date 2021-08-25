const express = require('express');
const tareaController = require('../controllers/tareaController');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/',
    auth,
    [
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('proyecto', 'El proyecto es requerido').not().isEmpty(),
    ],
    tareaController.crearTareas
);

router.get('/:id',
    auth,
    tareaController.getTareasByProyecto,
);

router.put('/:id',
    auth,
    tareaController.actualizaEstadoTarea,
);

router.delete('/:id',
    auth,
    tareaController.eliminarTarea,
);

module.exports = router;
