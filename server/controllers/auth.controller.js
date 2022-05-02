import User from "../models/user.model";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import { getParams } from "../helpers/email";

AWS.config.update({
  accessKeyId: process.env.API_ACCESS_KEY_ID,
  secretAccessKey: process.env.API_ACCESS_KEY_SECRET,
  region: process.env.API_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      error: "User already exists",
    });
  }
  const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const params = getParams(email, token);
  const sendEmail = ses.sendEmail(params).promise();
  sendEmail
    .then((data) => {
      return res.json({
        message: `Email has been sent to ${email}. Follow the steps to complete your registration`,
      });
    })
    .catch((err) => {
      console.log("Ses email error", err);
      return res.status(400).json({
        error: `We could not verify your email, please try again`,
      });
    });
};

export default { register };
