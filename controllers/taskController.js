const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

/**
 * @name:createTask.
 * @description:add a task to DB.
 * @param:request & response.
 * @return:json object.
*/
exports.createTask = async (req, res) => {
    //Check errors from req
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        //Extract project and check if exists
        const {project} = req.body;

        const projectFound = await Project.findById(project);
        if(!projectFound) {
            return res.status(404).json({msg: 'Proyecto no encontrado.'});
        }

        //Verify the creator id of the project
        if(projectFound.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usuario no autorizado a crear tareas.'})
        }

        //Create new task
        const task = new Task(req.body);
        await task.save();

        res.json(task);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error creando tarea.');
    }
}

/**
 * @name:getTasks
 * @description:gets tasks from a project.
 * @param:request & response.
 * @return:json objects.
*/
exports.getTasks = async (req, res) => {
    try {
        //Extract project from req and check if exists
        const {project} = req.query;

        const projectFound = await Project.findById(project);
        if(!projectFound) {
            return res.status(404).json({msg: 'Proyecto no encontrado.'});
        }

        //Verify the creator id of the project
        if(projectFound.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usuario no autorizado a ver las tareas del proyecto.'})
        }

        //Get tasks from a project
        const tasks = await Task.find({project});
        res.json({ tasks });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error obteniendo tareas.');
    }
}

/**
 * @name:updateTask.
 * @description:update a task.
 * @param:request & response.
 * @return:json object.
 */
exports.updateTask = async (req, res) => {
    try {
        //Extract project, task name & task status from req
        const {project, name , status} = req.body;

        //Check if the task exists
        let task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).json({msg: 'Tarea no encontrada.'})
        }

        //Check if the project exists
        const projectFound = await Project.findById(project);
        if(!projectFound) {
            return res.status(404).json({msg: 'El proyecto al cual pertenece la tarea no ha sido encontrado.'})
        }

        //Verify the creator id of the project
        if(projectFound.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usuario no autorizado a actualizar tareas.'})
        }

        //Create task object
        const updatedTask = {};
        updatedTask.name = name;
        updatedTask.status = status;

        //Update
        task = await Task.findOneAndUpdate({_id: req.params.id}, updatedTask, {new: true});

        res.json({task});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error actualizando tarea.');
    }
}

/**
 * @name:deleteTask.
 * @description:delete a task.
 * @param:request & response.
 * @return:json object.
*/
exports.deleteTask = async (req, res) => {
    try {
        //Extract project from req
        const {project} = req.query;

        //Check if the task exists
        let task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).json({msg: 'Tarea no encontrada.'})
        }

        //Check if the project exists
        const projectFound = await Project.findById(project);
        if(!projectFound) {
            return res.status(404).json({msg: 'El proyecto al cual pertenece la tarea no ha sido encontrado.'})
        }

        //Verify the creator id of the project
        if(projectFound.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usuario no autorizado a eliminar tareas.'})
        }

        //Delete
        await Task.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea eliminada.'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error eliminando tarea.');
    }
}