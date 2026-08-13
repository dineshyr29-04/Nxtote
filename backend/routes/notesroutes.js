const { createnoteschema, updateschema } = require("../validate/noteschema");
const { validate } = require("../middleware/validationmiddleware");
const express = require("express");
const notescontroller = require("../controller/notescontroller");
const { authenticateuser } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/notes", authenticateuser, notescontroller.getAllNotes);
router.get("/notes/:id",authenticateuser,notescontroller.getNotesById);
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

module.exports = router;
