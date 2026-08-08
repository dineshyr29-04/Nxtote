const express = require('express');
const notescontroller = require('../controller/notescontroller');
const { authenticateuser } = require('../middleware/authmiddleware');
const router = express.Router();  

router.use(authenticateuser);

router.get("/", notescontroller.getAllNotes);
router.post("/notes", notescontroller.createNote);
router.post("/notes/:id", notescontroller.updateNote);
router.delete("/notes/:id", notescontroller.deleteNote);

module.exports = router;
