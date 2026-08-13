const supabase = require("../lib/supabase");
const apiError = require("../utils/apierror");
exports.getAllNotes = async (userid) => {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userid)
        .eq("is_deleted", false);

    if (data.length===0) {
        throw new apiError(404, "Notes Not Found");
    }
    if (error) {
        throw new apiError(500, "Failed to fetch Notes");
    }
    

    return data;
};

exports.createNote = async (notedata) => {
    const { data, error } = await supabase.from("notes").insert(notedata).select().single();

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
        .eq("user_id", updates.userid)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

exports.deleteNote = async (id, userid) => {
    const { data, error } = await supabase

        .from("notes")
        .update({ is_deleted: true })
        .eq("user_id", userid)
        .eq("id", id)
        .select();

    if (error) {
        throw error;
    }

    return data.length > 0;
};
