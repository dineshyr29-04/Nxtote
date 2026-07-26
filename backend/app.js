const express =require('express');
const approuter=require('./routes/routes');
const app=express();

app.use(express.json());
app.use('/notes',approuter);
module.exports=app;