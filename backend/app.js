const express =require('express');
const notesRouter=require('./routes/routes.js')
const app=express();
app.use(express.json());
app.use("/",notesRouter); 
module.exports=app;