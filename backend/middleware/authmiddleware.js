const createsupabaseclient = require("../lib/supabase");
exports.authenticateuser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token Required"
      });
    }

    const token = authHeader.split(" ")[1];
    req.supabase = createsupabaseclient(token);
    const { data, error } = await  req.supabase.auth.getUser(token);

    if (error) {
      throw error
    }

    req.user = data.user
    next();
  }
  catch (error) {

    res.status(401).json({
      message: "Unauthorized"
    });

  }
};
