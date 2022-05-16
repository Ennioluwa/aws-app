import categoryModel from "../models/category.model";
import linkModel from "../models/link.model";
import userModel from "../models/user.model";

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
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  linkModel
    .find({})
    .populate("postedBy", "_id name username")
    .populate("categories", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec((err, data) => {
      if (err || !data) {
        return res
          .status(400)
          .json({ error: "Could not get links. Please try again." });
      }
      return res.json(data);
    });
};
const read = async (req, res) => {
  const _id = req.params.slug;
  console.log(_id);
  linkModel.findById(_id).exec((err, link) => {
    if (err || !link) {
      return res.status(400).json({ error: "Could not get link" });
    }
    return res.json(link);
  });
};
const update = async (req, res) => {
  const _id = req.params.slug;
  const { title, type, url, categories, medium } = req.body;
  linkModel
    .findByIdAndUpdate(
      _id,
      { title, type, url, categories, medium },
      { new: true }
    )
    .exec((err, data) => {
      if (err || !data) {
        return res.status(400).json({ error: "Could not update link" });
      }
      return res.json(data);
    });
};
const remove = async (req, res) => {
  const _id = req.params.slug;
  linkModel.findByIdAndDelete(_id).exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({ error: "Could not delete link" });
    }
    return res.json(data);
  });
};
const clicks = async (req, res) => {
  const _id = req.body;
  linkModel
    .findByIdAndUpdate(_id, { $inc: { clicks: 1 } }, { new: true })
    .populate("categories", "name")
    .populate("postedBy", "_id name username")
    .exec((err, result) => {
      if (err || !result) {
        return res.status(400).json({ error: "Unable to update link" });
      }
      res.json(result);
    });
};
const like = async (req, res) => {
  const _id = req.auth._id;
  const linkId = req.params.id;
  console.log(_id);
  userModel.findOne({ _id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Unable to get user" });
    }
    linkModel
      .findOneAndUpdate(
        { _id: linkId },
        { $push: { likes: user._id } },
        { new: true }
      )
      .populate("likes", "_id name")
      .populate("postedBy", "name")
      .populate("categories", "name")
      .exec((err, response) => {
        if (err || !response) {
          return res.status(400).json({ error: "Unable to get link" });
        }
        res.json(response);
      });
  });
};
const unlike = async (req, res) => {
  const _id = req.auth._id;
  const linkId = req.params.id;
  userModel.findById(_id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Unable to get user" });
    }
    linkModel
      .findOneAndUpdate(
        { _id: linkId },
        { $pull: { likes: user._id } },
        { new: true }
      )
      .populate("postedBy", "name")
      .populate("categories", "name")
      .populate("likes", "_id name")
      .exec((err, response) => {
        if (err || !response) {
          return res.status(400).json({ error: "Unable to get user" });
        }
        res.json(response);
      });
  });
};
const trending = async (req, res) => {
  linkModel
    .find({})
    .populate("categories", "name")
    .populate("postedBy", "_id name username")
    .sort({ clicks: -1 })
    .limit(5)
    .exec((err, links) => {
      if (err || !links) {
        return res.status(400).json({ error: "Unable to get links" });
      }
      return res.json(links);
    });
};

const filter = async (req, res) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 6;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  const { type, medium } = req.body;
  console.log(type, "type", medium, "medium");
  categoryModel
    .findOne({ slug })
    .populate("postedBy", "_id name username")
    .exec((err, category) => {
      if (err || !category) {
        return res.status(400).json({ error: "Unable to get category" });
      }
      // return res.json({ data: category });
      linkModel
        .find({ categories: category })
        .find(type ? { type: type } : {})
        .find(medium ? { medium: medium } : {})
        .populate("postedBy", "_id name username")
        .populate("categories", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec((err, links) => {
          if (err || !links) {
            return res
              .status(400)
              .json({ error: "Unable to get links from category" });
          }

          return res.json({ message: "Links", links, category });
        });
    });
};
export default {
  create,
  list,
  read,
  update,
  remove,
  clicks,
  trending,
  like,
  unlike,
  filter,
};
