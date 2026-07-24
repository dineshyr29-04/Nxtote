const app=require('./app');

const PORT=3000;

app.get("/",(req,res)=>{
    res.json({mesage: "Hello from the backend!"});
})
app.listen(PORT,()=>{
    console.log(`Serveris running on port ${PORT}`);
});
