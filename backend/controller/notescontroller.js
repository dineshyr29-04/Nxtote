const notesService = require("../services/notesservice.js");

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await notesService.getAllNotes(req.user.id);
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
    const { title, content, completed } = req.body;

    const userid=req.user.id
    const useremail = req.user.email;
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are requried",
      });
    }

    const note = await notesService.createNote({
      title : title,
      content: content,
      user_id:userid,
      completed: completed ||false
    });

    return res.status(201).json(note);
  } catch (error) {
        console.error(error);
        res.status(500).json({
        message: "Internal server error",
        });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userid = req.user.id;
    const updatedNote = await notesService.updateNote({ id, userid, updates });

    if (!updatedNote) {
      return res.status(404).json({
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

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user.id;
    const deletenote = await notesService.deleteNote(id,userid);

    if (!deletenote) {
      console.log("note not deleted");
      return res.status(404).json({
        message: "Note Not Found"
      });
    }

    res.status(200).json({
      message: "Note Deleted Successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}