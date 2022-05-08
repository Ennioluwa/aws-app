import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: ["Name is required"],
      max: 20,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    image: {
      url: String,
      key: String,
    },
    content: {
      type: {},
      min: 20,
      max: 20000,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
