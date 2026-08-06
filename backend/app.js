const express = require("express");
const notesRouter = require("./routes/notesroutes.js");
const authrouter = require("./routes/authroute.js");
const { authenticateuser } = require("./middleware/authmiddleware");
const { errorhandler } = require("./middleware/errormiddleware.js");
const cors = require("cors");

const app = express();
app.use(
  cors({
    oringin: ["http://localhost:5173", "https://nxtote.vercel.app/"],
  }),
);
app.use(express.json());


app.use("/", authenticateuser, notesRouter);
app.use("/auth", authrouter);

app.use(errorhandler);

module.exports = app;
