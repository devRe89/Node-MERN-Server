const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    //Leer token del header
    const token = req.header('x-auth-token');
    console.log(token);
    //Revisar si esta vacio
    if (token === null) {
        return res.status(401).json({ msg: "Acceso denegado, No hay token."});
    }
    //Validar token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Acceso denegado" });
    }
}