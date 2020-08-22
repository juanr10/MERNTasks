const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

/**
 * @name:createProject.
 * @description:add a project to DB.
 * @param:request & response.
 * @return:json object.
*/
exports.createProject = async (req, res) => {
    //Check errors from req
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    try {
        const project = new Project(req.body);
        //Save creator via JWT
        project.creator = req.user.id;
        //Add to DB.
        project.save();
        res.json(project);   

    } catch (error) {
        console.log(error);
        res.status(500).send('Error creando proyecto.');
    }
}

/**
 * @name:getProjects.
 * @description:gets the projects of the authenticated user.
 * @param:request & response.
 * @return:json objects.
*/
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({creator: req.user.id}).sort({created: -1});
        res.json({projects});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error obteniendo proyectos.');
    }
}

/**
 * @name:updateProject.
 * @description:update a project.
 * @param:request & response.
 * @return:json object.
*/
exports.updateProject = async (req, res) => {
    //Check errors from req
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //Extract data from project
    const {name} = req.body;
    const updatedProject = {};

    if(name) {
        updatedProject.name = name;
    }

    try {
        //Check ID
        let project = await Project.findById(req.params.id);
        //Check project existence
        if(!project) {
            return res.status(404).json({msg: 'Proyecto no encontrado.'})
        }
        //Verify the creator id of the project
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usuario no autorizado a actualizar proyectos.'})
        }
        //Update
        project = await Project.findOneAndUpdate({_id: req.params.id}, {$set : updatedProject}, {new: true});
    
        res.json({project});
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Error actualizando proyecto.');
    }
}

/**
 * @name:deleteProject.
 * @description:delete a project.
 * @param:request & response.
 * @return:json object.
 */
exports.deleteProject = async (req, res) => {
    try {
        //Check ID
        let project = await Project.findById(req.params.id);
        //Check project existence.
        if(!project) {
            return res.status(404).json({msg: 'Proyecto no encontrado.'})
        }
        //Verify the creator id of the project
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'Usuario no autorizado a eliminar proyectos.'})
        }
        //Delete project tasks
        await Task.deleteMany({project: req.params.id});
        //Delete project 
        await Project.findOneAndRemove({_id: req.params.id});
       
        res.json({msg: 'Proyecto eliminado.'});
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Error eliminando proyecto.');
    }
}
