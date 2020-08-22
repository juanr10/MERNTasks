const jwt = require('jsonwebtoken');

/**
 * @name:authentication middleware.
 * @description:check if a token exists and the validity of this one.
 * @param:request, response & next func.
 * @return:json object.
*/
module.exports = function(req, res, next){
    //Reading token from header
    const token = req.header('x-auth-token');

    //Check if there's a token
    if(!token){
        return res.status(404).json({msg: 'Permiso denegado, no hay registrado un token de registro. Por favor, inicia sesión.'});
    }

    //Validate token
    try {
        const encryption = jwt.verify(token, process.env.SECRET);
        req.user = encryption.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token de acceso no válido.'});
    }
}