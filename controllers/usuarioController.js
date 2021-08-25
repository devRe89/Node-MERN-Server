const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuarios = async(req, res) => {

    //Destructuring de req.body
    const { email, password } = req.body;
    const errores = validationResult(req);
    if ( !errores.isEmpty() ){
        return res.status(400).json({errores: errores.array()});
    }
    try {
        //Validar que email no exista
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        //crear nuevo usuario
        usuario = new Usuario(req.body);

        //encriptar contraseña usuario
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(String(password), salt);

        //guardar usuario creado
        await usuario.save();

        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) =>{
            if (error) throw error;

            res.json({ token: token });
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Hubo un error' });
    }
}