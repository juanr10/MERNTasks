const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

//Route for creating users (requests on api/users)
router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'A valid email is required').isEmail(),
        check('password', 'The password must be at least 6 characters long.').isLength( {min:6} )
    ], 
    userController.createUser);

module.exports = router;
