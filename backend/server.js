const app=require('./app');
const express =require('express');

const PORT=3000;



app.listen(PORT,()=>{
    console.log(`Serveris running on port ${PORT}`);
});
