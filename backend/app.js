const express =require('express');
const notesRouter = require('./routes/notesroutes.js');
const authrouter = require('./routes/authroute.js');
const {authenticateuser} = require('./middleware/authmiddleware');

const cors =require('cors');


const app=express();

app.use(express.json());
app.use(cors());


app.use("/",authenticateuser,notesRouter);
app.use("/auth", authrouter);
module.exports = app;