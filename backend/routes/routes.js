const express = require('express');
const { q } = require('framer-motion/client');

const router = express.Router();  

router.get("/", (req, res) => {
    res.json({message: "Hello from the backend!"});
});

router.post("/note",(req, res) => {
    res.json({message: "Note created successfully!"});
});

module.exports=router;