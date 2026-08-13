const notesService = require("../services/notesservice.js");
const asynchandler = require("../utils/asynchandler.js");
const Apierror = require("../utils/apierror.js");
const apiResponse = require("../utils/apiresponse.js");
exports.getAllNotes = asynchandler(async (req, res) => {
    const notes = await notesService.getAllNotes(req.user.id);
    res.status(200).json(new apiResponse(true, "The Notes are retrieved", notes));
});

exports.createNote = asynchandler( async (req, res) => {
    const { text, category, content, priority, completed } = req.body;
    const userid = req.user.id;
    const useremail = req.user.email;
    if (!text || !category) {
        throw new Apierror(400, "Text or category required");
    }

    const note = await notesService.createNote({
        title: text,
        content: content,
        category,
        priority: priority || "medium",
        completed: completed || false,
        user_id: userid,
    });
    console.log("Note Created Successfully");
    return res.status(201).json(new apiResponse(true, "Note Created successfully", note));
});

exports.updateNote = asynchandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userid = req.user.id;
    const updatedNote = await notesService.updateNote({ id, userid, updates });

    if (!updatedNote) {
        throw new Apierror(404, "Note Not found");
    }
    console.log("Note Updated successfully");
    res.status(200).json(new apiResponse(true, "Note updated successfully", updatedNote));
});

exports.deleteNote = asynchandler(async (req, res) => {
    const { id } = req.params;
    const userid = req.user.id;
    const deletenote = await notesService.deleteNote(id, userid);

    if (!deletenote) {
        console.log("note not deleted");
        throw new Apierror(404, "Note not deleted");
    }
    console.log("NoteDeleted successfully");
    res.status(200).json(new apiResponse(true, "Note delete successfully"));
});
