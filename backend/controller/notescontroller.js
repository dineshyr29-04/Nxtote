const notesService = require("../services/notesservice.js");
const asynchandler = require("../middleware/asynchandler.js");
exports.getAllNotes = asynchandler(async (req, res) => {
  const notes = await notesService.getAllNotes(req.user.id);
  res.status(200).json(notes);
});

exports.createNote = asynchandler(async (req, res) => {
    const { text, category, priority, completed } = req.body;
      const userid=req.user.id
      const useremail = req.user.email;
      if (!text || !category) {
        return res.status(400).json({
          message: "Title and category are requried",
        });
      }
  
      const note = await notesService.createNote({
        title:text,
        category ,
        priority:priority ||"medium",
        completed: completed || false,
        user_id:userid
      });
  
      return res.status(201).json(note);
});

exports.updateNote = asynchandler(async (req, res) => {
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
})

exports.deleteNote = asynchandler(async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  const deletenote = await notesService.deleteNote(id, userid);

  if (!deletenote) {
    console.log("note not deleted");
    return res.status(404).json({
      message: "Note Not Found"
    });
  }

  res.status(200).json({
    message: "Note Deleted Successfully"
  });
});