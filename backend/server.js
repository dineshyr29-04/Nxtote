const express = require('express');
const app = express();

const port = 3000;

app.use(express.json());

function logger(res, req, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}

function middlewaretwo(req,res,next){
    console.log("Middleware 2");
    next();
}

app.use(logger);

app.use(middlewaretwo);

app.get("/", (req, res) => {
    res.json({
        message: "Nxtote Backend is running"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});