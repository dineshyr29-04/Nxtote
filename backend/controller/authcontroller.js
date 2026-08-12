const authservice = require("../services/authservices.js");
const asynchandler = require("../utils/asynchandler.js");
exports.register = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    console.log({ name, email, password });
    if (!email || !password) {
        console.log("Email or password any one is wrong");
        return res.status(400).json({
            message: "User Credentials are Required",
        });
    }
    const user = await authservice.register(name, email, password);
    console.log("Registered");
    res.status(201).json(user);
});

exports.login = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("error in passwords");
        return res.status(400).json({
            message: "Required email and password.",
        });
    }

    const data = await authservice.login({ email, password });
    console.log("loggedin");
    res.status(200).json(data);
});
