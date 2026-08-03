const express = require('express');
const notescontroller = require('../controller/controller');
const router = express.Router();  

router.get("/", notescontroller.getAllNotes);
router.post("/notes",notescontroller.createNote);

module.exports=router;