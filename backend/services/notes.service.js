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
