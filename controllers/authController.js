const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * @name:authenticateUser.
 * @description:creates a JWT when a user is authenticated.
 * @param:request & response.
 * @return:json object.
 */
exports.authenticateUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //Check registered user
        let user = await User.findOne({email});
        if(!user){
            return res.status(404).json({msg: 'El usuario indicado no existe.'})
        }

        //Check password
        const passCheck = await bcryptjs.compare(password, user.password);
        if(!passCheck){
            return res.status(401).json({msg: 'La contraseña es incorrecta.'});
        }

        //Create & sign JWT
        const payload = {
            user: {
                id: user.id
            }
        }  

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            res.json({ token });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error autenticando usuario.');
    }
}

/**
 * @name:userAuthenticated.
 * @description:Get user authenticated (All data except the password).
 * @param:request & response.
 * @return:json object.
 */
exports.userAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error obteniendo usuario autenticado.');
    }
}