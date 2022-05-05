import express from "express";
const morgan = require("morgan");
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";
import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";
import cookieParser from "cookie-parser";
import csrf from "csurf";

const csrfProtection = csrf({ cookie: true });
// mongoose database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));
//port
const port = process.env.PORT;
// initialize app
const app = express();
//middlewares
app.use(cookieParser());
// app.use(csrf({ cookie: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(csrfProtection);
app.use("/", authRoute);
app.use("/", userRoute);

app.get("/api/csrf-token", (req, res) => {
  try {
    res.json({ csrfToken: req.csrfToken() });
  } catch (error) {
    console.log(error);
  }
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name });
  } else {
    console.log(err);
  }
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  // handle CSRF token errors here
  res.status(403);
  res.send("CSURF error");
});

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
