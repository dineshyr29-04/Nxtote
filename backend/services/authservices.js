const supabase = require("../lib/supabase");

exports.register = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({ name, email, password });

    if (error) {
        throw error;
    }
    return data;
};

exports.login = async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
        throw error;
    }

    return data;
};
