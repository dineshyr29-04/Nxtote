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

exports.createNote = async(req, res) => {
    try {
        const {title , content , folder_id} =req.body;
        
        if (!title || !content ){
            res.status(400).json({
                message:"Title and content are requried"
            });
        };

        const note = await notesService.createNote({
            title,
            content,
            folder_id
        });

        res.status(201).json(note);
    }
    catch (error){
        res.status(500).json({
            message:"Internal server error"
        });
    };

};