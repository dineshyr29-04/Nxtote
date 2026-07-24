const express =require('express');
const approuter=require('./routers/routes');
const notescontroller=require('./controllers/notescontroller');
const app=express();

app.use(express.json());
app.use('/notes',approuter);
module.exports=app;