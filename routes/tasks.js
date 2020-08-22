const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Routes for tasks management (requests on api/tasks)
/*GET tasks*/
router.get('/',
    auth,
    taskController.getTasks
);

/*POST tasks*/
router.post('/',
    auth,
    [
        check('name', 'The name of the task is required.').not().isEmpty(),
        check('project', 'The name of the project is required.').not().isEmpty()
    ],
    taskController.createTask
);

/*Update a task via ID*/
router.put('/:id', 
    auth,
    taskController.updateTask
)

/*Delete a task via ID*/
router.delete('/:id', 
    auth,
    taskController.deleteTask
)

module.exports = router;