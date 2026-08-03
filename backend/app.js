const express =require('express');
const notesRouter = require('./routes/notesroutes.js');
const authrouter = require('./routes/authroute.js');
const cors =require('cors');


const app=express();

app.use(express.json());
app.use(cors());


app.use("/",notesRouter);
app.use("/register", authrouter);
module.exports=app;