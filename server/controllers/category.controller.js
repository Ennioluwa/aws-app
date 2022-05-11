import slugify from "slugify";
import categoryModel from "../models/category.model";
import linkModel from "../models/link.model";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import fs from "fs";

const s3 = new AWS.S3({
  accessKeyId: process.env.API_ACCESS_KEY_ID,
  secretAccessKey: process.env.API_ACCESS_KEY_SECRET,
  region: process.env.API_REGION,
});

// const create= async (req, res) => {
//   const { name, content } = req.body;
//   const slug = slugify(name);
//   const image = {
//     url: "https://via.placeholder.com/200x150",
//     key: "123",
//   };
//   const postedBy = req.auth._id;
//   const category = new categoryModel({ name, content, image, slug, postedBy });
//   try {
//     await category.save();
//     return res.json({ message: "Category created", category });
//   } catch (error) {
//     res.status(400).json({ error: "Unable to create category" });
//   }
// };

// const create = async (req, res) => {
//   const form = new formidable.IncomingForm();
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.log(err, "formidable form error");
//       return res.status(400).json({ error: "Unable to create category" });
//     }
//     const { name, content } = fields;
//     const { image } = files;
//     const slug = slugify(name);

//     let category = new categoryModel({ name, slug, content });

//     const params = {
//       Bucket: "enioluwa",
//       Key: `catagory/${uuidv4()}`,
//       Body: fs.readFileSync(image.filepath),
//       ACL: "public-read",
//       ContentType: "image/jpg",
//     };

//     s3.upload(params, async function (err, response) {
//       if (err) {
//         console.log(err, "aws upload error");
//         return res.status(400).json({ error: "Unable to upload image to s3" });
//       }
//       console.log(response);
//       category.image.url = response.Location;
//       category.image.key = response.Key;

//       try {
//         await category.save();
//         return res.json({ message: "Category uploaded", category });
//       } catch (error) {
//         console.log(error);
//         return res.status(400).json({ error: "Unable to create category" });
//       }
//     });
//   });
// };
const create = (req, res) => {
  const { name, image, content } = req.body;
  console.log({ name, image, content });
  // image data
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = image.split(";")[0].split("/")[1];
  const slug = slugify(name);
  let category = new categoryModel({ name, content, slug });

  const params = {
    Bucket: "enioluwa",
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Upload to s3 failed" });
    }
    console.log("AWS UPLOAD RES DATA", data);
    category.image.url = data.Location;
    category.image.key = data.Key;

    // save to db
    category.save((err, success) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Duplicate category" });
      }
      return res.json({ message: "Category uploaded", success });
    });
  });
};

const list = async (req, res) => {
  const data = await categoryModel.find({});
  if (!data) {
    return res.status(400).json({ error: "Unable to get category" });
  }

  return res.json({ message: "All posts", data });
};
const read = async (req, res) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  console.log(slug);
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
const update = async (req, res) => {
  res.json({ message: "created" });
};
const remove = async (req, res) => {
  res.json({ message: "created" });
};

export default { create, list, read, update, remove };
