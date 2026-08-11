const express = require("express");
const authcontroller = require("../controller/authcontroller.js");
const router = express.Router();

router.post("/signup", authcontroller.register);
router.post("/login", authcontroller.login);
module.exports = router;
