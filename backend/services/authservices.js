exports.register = async (supabaseClient, name, email, password) => {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
            },
        },
    });

    if (error) {
        throw error;
    }
    return data;
};

exports.login = async (supabaseClient, credentials) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);

    if (error) {
        throw error;
    }

    return data;
};
