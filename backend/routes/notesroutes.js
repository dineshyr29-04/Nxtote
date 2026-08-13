const { createnoteschema, updateschema } = require("../validate/noteschema");
const { validate } = require("../middleware/validationmiddleware");
const express = require("express");
const notescontroller = require("../controller/notescontroller");
const { authenticateuser } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/notes", authenticateuser, notescontroller.getAllNotes);
router.post(
    "/notes",
    authenticateuser,
    validate(createnoteschema),
    notescontroller.createNote
);
router.patch(
    "/notes/:id",
    authenticateuser,
    validate(updateschema),
    notescontroller.updateNote,
);
router.delete("/notes/:id", authenticateuser, notescontroller.deleteNote);
module.exports = router;
