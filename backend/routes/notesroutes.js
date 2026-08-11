const express = require("express");
const notescontroller = require("../controller/notescontroller");
const { authenticateuser } = require("../middleware/authmiddleware");
const router = express.Router();

router.get("/", authenticateuser, notescontroller.getAllNotes);
router.post("/notes", authenticateuser, notescontroller.createNote);
router.patch("/notes/:id", authenticateuser, notescontroller.updateNote);
router.delete("/notes/:id", authenticateuser, notescontroller.deleteNote);

module.exports = router;
