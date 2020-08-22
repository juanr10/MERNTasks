const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Route for authenticate users (requests on api/auth)
/*Log in*/
router.post('/', authController.authenticateUser);

/*Get user authenticated*/
router.get('/',
    auth,
    authController.userAuthenticated
);



module.exports = router;
