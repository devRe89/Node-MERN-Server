// Rutas para autenticar usuario

const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//api/usuarios
//Iniciar sesión
router.post('/',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado,
)

module.exports = router;