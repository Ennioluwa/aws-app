import express from "express";
const morgan = require("morgan");
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";
import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";

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
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/", userRoute);
app.use("/", authRoute);

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
