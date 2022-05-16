import User from "../models/user.model";
import Link from "../models/link.model";
import lodash from "lodash";

const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json({ users });
};
const read = async (req, res) => {
  const { _id } = req.auth;
  const user = await User.findById(_id);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  Link.find({ postedBy: user })
    .populate("postedBy", "_id name")
    .populate("categories", "name slug")
    .sort({ createdAt: -1 })
    .exec((err, links) => {
      if (!links || err) {
        return res.status(400).json({ error: "Links not found" });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      return res.json({ user, links });
    });
};
const update = (req, res) => {
  const { name, password } = req.body;
  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be greater than 6 characters" });
  }
  // User.findOneAndUpdate(
  //   { _id: req.auth._id },
  //   { name, password },
  //   { new: true }
  // ).exec((err, data) => {
  //   if (!data || err) {
  //     return res.status(400).json({ error: "Could not update user" });
  //   }
  //   data.hashed_password = undefined;
  //   data.salt = undefined;
  //   return res.json({ data, message: "Profile has been updated" });
  // });
  User.findById(req.auth._id, async function (err, data) {
    if (err || !data) {
      return res.status(401).send({ error: "User not found." });
    }
    console.log(data);
    if (password && data.authenticate(password)) {
      return res.status(400).json({
        error:
          "Password cannot be the same as the previous password. Please use a different password",
      });
    }
    if (password) {
      var newUser = lodash.extend(data, { password, name });
    } else {
      var newUser = lodash.extend(data, { name });
    }
    try {
      await newUser.save();
      return res.status(200).json({ message: "Updated successfully", data });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Error updating user" });
    }
  });
};

export default { update, read };
