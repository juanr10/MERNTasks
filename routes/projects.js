const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Routes for projects management (requests on api/projects)
/*GET projects*/
router.get('/', 
    auth,
    projectController.getProjects
)

/*Add a project*/
router.post('/', 
    auth,
    [
        check('name', 'The name of the project is required.').not().isEmpty()
    ],
    projectController.createProject
)

/*Update a project via ID*/
router.put('/:id', 
    auth,
    [
        check('name', 'The name of the project is required.').not().isEmpty()
    ],
    projectController.updateProject
)

/*Delete a project via ID*/
router.delete('/:id', 
    auth,
    projectController.deleteProject
)

module.exports = router;