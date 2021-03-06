// Rutas para crear usuarios

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

//Crear un usuarios
//api/usuarios
router.post('/',
    [
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
    ],
    usuarioController.crearUsuarios
);

module.exports = router;