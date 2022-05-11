import linkModel from "../models/link.model";

const create = async (req, res) => {
  const { title, type, url, categories, medium } = req.body;
  const slug = url;
  let link = new linkModel({ title, url, slug, type, medium, categories });
  link.postedBy = req.auth._id;
  // console.log(categories);
  // const arrayCategories = categories && categories.split(",");
  // console.log(arrayCategories);
  // link.categories = arrayCategories;
  // console.log("befors savig", arrayCategories);
  // console.log(link);
  try {
    console.log("new link", link);
    const user = await link.save();
    console.log(user);
    res.json({ message: "Link created", link });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Link could not be created. Please try again." });
  }
};

const list = async (req, res) => {
  linkModel.find({}).exec((err, data) => {
    if (err || !data) {
      return res
        .status(400)
        .json({ error: "Link could not be created. Please try again." });
    }
    return res.json(data);
  });
};
const read = async (req, res) => {
  console.log();
};
const update = async (req, res) => {
  console.log();
};
const remove = async (req, res) => {
  console.log();
};
const clicks = async (req, res) => {
  const _id = req.body;
  linkModel
    .findByIdAndUpdate(_id, { $inc: { clicks: 1 } }, { new: true })
    .populate("categories", "name")
    .populate("postedBy", "_id name username")
    .exec((err, result) => {
      if (err || !result) {
        res.status(400).json({ error: "Unable to update link" });
      }
      res.json(result);
    });
};
export default { create, list, read, update, remove, clicks };
