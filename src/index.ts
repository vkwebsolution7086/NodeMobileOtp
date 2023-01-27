import connectDB from "../config/dbconnection";
import express from "express";
import sendotp from "./routes/sendOtp";
const bodyParser = require("body-parser");
const app = express();

//connect to db
connectDB();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use('/api',sendotp);

const port = app.get("port")
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;