const notesService = require('../services/notes.service.js');

exports.getAllNotes = async (req, res) => {
    try {
        const notes = await notesService.getAllNotes();
        res.status(200).json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

};

exports.createNote = (req, res) => {

    res.json({
        message: "Create Note"
    });

};