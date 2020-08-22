/**
 * @name: MERNTasks API.
 * @description:Created with Node using Express.js, bcryptjs & JWT (JsonWebToken).
 * @author: Juan Argudo.
 * @version: 14/05/2020.
*/
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//Creating server
const app = express();
//Connecting DB
connectDB();
//Enable cors
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());
//Express.json
app.use(express.json({ extended: true }));

//App port
const port = process.env.PORT || 4000;

//Import routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

//Run server
app.listen(port, '0.0.0.0' ,() => {
    console.log(`The server is running on port ${port}`);
});
