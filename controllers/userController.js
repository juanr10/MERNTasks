const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * @name:createUser.
 * @description:inserts a new user to DB & create a JWT.
 * @param:request & response.
 * @return:json object.
 */
exports.createUser = async (req, res) => {
    //Check errors from req
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //Extract email & password from req
    const { email, password } = req.body;

    try {
        //Validation: Checks if the email already exists
        let user = await User.findOne({ email });
        if(user){
            return res.status(401).json({ msg:'Ya existe un usuario con el correo indicado.' });
        }

        //Create new user
        user = new User(req.body);

        //Hash password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
        
        //Add user to DB
        await user.save();

        //Create & sign JWT
        const payload = {
            user: {
                id: user.id
            }
        }  

        //JSW with duration of 1 hour
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            res.json({ token });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error insertando usuario.');
    }
}