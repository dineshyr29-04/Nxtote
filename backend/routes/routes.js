const express = require('express');
const notescontroller = require('../controller/controller');
const router = express.Router();  

router.get("/", notescontroller.getAllNotes);


module.exports=router;