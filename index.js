const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const users = require('./app/users');
const tasks = require('./app/tasks');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

const run = async () => {
    await mongoose.connect("mongodb://localhost/todoList", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    console.log("Connected to MongoDB");
    app.use('/users', users);
    app.use('/tasks', tasks);
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
};

run().catch(console.log);