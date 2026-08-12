const supabase = require("../lib/supabase");

exports.register = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
            data: {
                name: name
            }
        }
    });

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
