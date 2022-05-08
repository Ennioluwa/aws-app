import User from "../models/user.model";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import { getParams, getResetParams } from "../helpers/email";
import { nanoid } from "nanoid";
import { expressjwt } from "express-jwt";
import lodash from "lodash";

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

const activate = async (req, res) => {
  const token = req.body.token;
  // console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ error: "Token has expired. Please register again." });
    }
    if (decoded) {
      const { name, email, password } = jwt.decode(token);
      const username = nanoid();
      let user = await User.findOne({ email });
      if (user) {
        return res.status(401).json({ error: "Email has been taken" });
      }
      console.log({ name, email, password, username });
      const newUser = new User({ name, email, password, username });
      console.log(newUser);
      try {
        await newUser.save();
        return res
          .status(200)
          .json({ message: "User activation successful. Please login" });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Error saving user to database" });
      }
    }
  });
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "User doesnt exist" });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(400).json({ error: "Password doesnt match" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_SIGNIN, {
      expiresIn: "1d",
    });
    const { _id, name, email, role } = user;
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    return res.status(200).json({ user: { _id, name, email, role } });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
};

const requireSignin = expressjwt({
  secret: process.env.JWT_SECRET_SIGNIN,
  algorithms: ["HS256"],
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
});
const hasAuthentication = async (req, res, next) => {
  const authId = req.auth._id;
  User.findById(authId).exec((err, user) => {
    if (!user || err) {
      return res.status(400).json({ error: "User not found" });
    }
    req.profile = user;
    next();
  });
};
const isAdmin = async (req, res, next) => {
  const authId = req.auth._id;
  User.findById(authId).exec((err, user) => {
    if (!user || err) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user.role !== "admin") {
      return res
        .status(400)
        .json({ error: "This is an admin esource. Access denied" });
    }
    req.profile = user;
    next();
  });
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "Unable to get user" });
  }
  const token = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    }
  );
  const params = getResetParams(user.email, token);
  const sendEmail = ses.sendEmail(params).promise();
  sendEmail
    .then((data) => {
      return res.json({
        message: `Email has been sent to ${user.email}. Follow the steps to reset your password`,
      });
    })
    .catch((err) => {
      console.log("Ses email error", err);
      return res.status(400).json({
        error: `We could not verify your email, please try again`,
      });
    });
};
const resetPassword = async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.newPassword;
  // console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ error: "Token has expired. Please register again." });
    }
    if (decoded) {
      const { _id } = jwt.decode(token);
      User.findById(_id, async function (err, data) {
        if (err || !data) {
          return res.status(401).send({ error: "User not found." });
        }
        console.log(data);
        if (data.authenticate(newPassword)) {
          return res
            .status(400)
            .json({
              error:
                "Password cannot be the same as the previous password. Please use a different password",
            });
        }
        const newUser = lodash.extend(data, { password: newPassword });
        try {
          await newUser.save();
          return res
            .status(200)
            .json({ message: "Password changed successfully. Please login" });
        } catch (error) {
          console.log(error);
          return res.status(400).json({ error: "Error resetting password" });
        }
      });
    }
  });
};

export default {
  register,
  activate,
  login,
  logout,
  requireSignin,
  hasAuthentication,
  isAdmin,
  forgotPassword,
  resetPassword,
};
