const authservice = require("../services/authservices.js");
const asynchandler = require("../utils/asynchandler.js");
const Apierror = require("../utils/apierror.js");
const apiResponse = require("../utils/apiresponse.js");
const createsupabaseclient = require("../lib/supabase.js");
const supabaseClient = createsupabaseclient();

exports.register = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    console.log({ name, email, password });
    if (!email || !password) {
        console.log("Email or password any one is wrong");
        throw new Apierror(400, "User credentials Required");
    }
    const user = await authservice.register(supabaseClient, name, email, password);
    console.log("Registered");
    res.status(201).json(new apiResponse(true, "Registered Successfuly", user));
});

exports.login = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("error in passwords");
        throw new Apierror(400, "User credentials Required");
    }

    const data = await authservice.login(supabaseClient, { email, password });
    console.log("loggedin");
    res.status(200).json(new apiResponse(true, "Loggedin Successfuly", data));
});
