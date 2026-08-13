const apiError = require("../utils/apierror");
exports.getAllNotes = async (supabaseClient,userid) => {
    const { data, error } = await supabaseClient
        .from("notes")
        .select("*")
        .eq("user_id", userid)
        .eq("is_deleted", false);

    
    if (error) {
        throw new apiError(500, "Failed to fetch Notes");
    }
    

    return data;
};

exports.createNote = async (supabaseClient,notedata) => {
    const { data, error } = await supabaseClient.from("notes").insert(notedata).select().single();

    if (error) {
        throw error;
    }
    return data;
};

exports.updateNote = async (supabaseClient,updates) => {
    const { data, error } = await supabaseClient
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

exports.deleteNote = async (supabaseClient,id, userid) => {
    const { data, error } = await supabaseClient

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
