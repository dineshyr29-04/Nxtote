const express =require('express');
const notesRouter=require('./routes/routes.js')
const app=express();
app.use(express.json());
app.use("/",notesRouter);
app.use("/notes",notesRouter);
module.exports=app;