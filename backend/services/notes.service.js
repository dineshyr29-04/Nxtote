const supabase = require("../lib/supabase");
exports.getAllNotes = async (req, res) => {
  const { data, error } = await supabase
        .from("notes")
        .select("*");

  if (error) {
    throw error;
  }

  return data;
};

exports.createNote = async (notedata) => {
  const { data, error } = await supabase
    .from("notes")
    .insert(notedata)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

exports.updateNote = async (updates) => {
  const { data, error } = await supabase
    .from("notes")
    .update(updates.updates)
    .eq("id", updates.id)
    .select()
    .single();

  if (error) {
    throw error
  }

  return data;
};