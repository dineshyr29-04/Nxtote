const app=require('./app');
require('dotenv').config();
const PORT=process.env.port ||3000;

app.listen(PORT,()=>{
    console.log(`Serveris running on port ${PORT}`);
});
