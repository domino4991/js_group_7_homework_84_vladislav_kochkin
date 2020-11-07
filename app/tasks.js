const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../authMiddleware');

router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user._id});
        console.log(tasks);
        if(!tasks || tasks.length === 0) return res.status(404).send({error: '404 not found'});
        return res.send(tasks);
    } catch (e) {
        return res.status(400).send({error: e});
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const task = new Task(req.body);
        task.user = req.user._id;
        await task.save();
        return res.send(task);
    } catch (e) {
        return res.status(400).send({error: e});
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).send({error: '404 not found'});
        if(task.user.toString() !== req.user._id.toString()) {
            return res.status(401).send({error: "You are not authorized to edit this issue."});
        }
        task.title = req.body.title ? req.body.title : task.title;
        task.description = req.body.description ? req.body.description : task.description;
        task.status = req.body.status ? req.body.status : task.status;
        await task.save();
        return res.send(task);
    } catch (e) {
        return res.status(400).send({error: e});
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).send({error: "404 not found"});
        if(task.user.toString() !== req.user._id.toString()) {
            return res.status(401).send({error: "You are not authorized to delete this issue."});
        }
        await task.remove();
        return res.send({message: `Task with id - ${req.params.id} deleted`});
    } catch (e) {
        return res.status(400).send({error: e});
    }
});

module.exports = router;