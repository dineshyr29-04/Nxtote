try {
    require('dotenv').config();

} catch (e){

}
const {createClient}=require('@supabase/supabase-js');

const supabaseurl=process.env.SUPABASE_URL;
const supabasekey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const createsupabaseclient = (accesstoken) => {
    return createClient(
        supabaseurl, supabasekey, {
        global: {
            headers: {
                Authorization: `Bearer ${accesstoken}`,
            },
        },
    }
    );
};

module.exports = createsupabaseclient;
