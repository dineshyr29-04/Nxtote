const authservice = require('../services/authservices.js');


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Email or password any one is wrong");
      return res.status(400).json({
        message: "User Credentials are Required"
      });
    }

    const user = await authservice.register(email, password);
    res.status(201).json(user);
  }
  catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("error in passwords");
      return res.status(400).json({
        message: "Required email and password."
      });
    }

    const data = await authservice.login({ email, password });

    res.status(200).json({
      message: "User Loggedin Successfuly"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Login Failed Wrong Email or Password"
    });
  }
};

