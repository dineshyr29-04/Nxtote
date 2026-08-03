const express = require('express');
const authcontroller = require("../controller/authcontroller.js");
const router = express.Router();

router.post("/", authcontroller.register);

module.exports = router;