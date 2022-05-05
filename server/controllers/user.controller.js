import User from "../models/user.model";

const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json({ users });
};
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

export default { getUsers, read };
