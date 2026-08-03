const notesService = require("../services/notes.service.js");

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await notesService.getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content, owner, completed } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are requried",
      });
    }

    const note = await notesService.createNote({
      title : title,
      content :content,
      owner: owner || 'you',
      completed: completed ||false
    });

    return res.status(201).json(note);
  } catch (error) {
        console.error("Error in createNote:", error);
        res.status(500).json({
        message: "Internal server error",
        });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedNote = await notesService.updateNote(id, updates);

    if (!updatedNote) {
      res.status(404).json({
        message: "Note Not Found"
      });
    }
    res.status(200).json(updatedNote);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
   }
}