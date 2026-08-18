const express = require("express");
const notesRouter = require("./routes/notesroutes.js");
const authrouter = require("./routes/authroute.js");
const healthrouter = require("./routes/healthroute.js");   
const { errorhandler } = require("./middleware/errormiddleware.js");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://nxtote.vercel.app"],
  }),
);
app.use(express.json());

app.use("/", notesRouter);
app.use("/auth", authrouter);
app.use("/health", healthrouter);
app.use(errorhandler);

module.exports = app;
