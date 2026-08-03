const supabase = require('../lib/supabase');

exports.register = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw error
  } 
  return data;
}