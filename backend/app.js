const express =require('express');
const notesRouter=require('./routes/notesroutes.js')
const cors =require('cors');


const app=express();

app.use(express.json());
app.use(cors());


app.use("/",notesRouter);

module.exports=app;