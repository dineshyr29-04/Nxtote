const express = require('express');
const notescontroller = require('../controller/controller');
const router = express.Router();  

router.get("/", notescontroller.getAllNotes);
router.post("/notes",notescontroller.createNote);
router.post("/notes/:id", notescontroller.updateNote);
router.delete("/notes/:id", notescontroller.deleteNote);
module.exports=router;