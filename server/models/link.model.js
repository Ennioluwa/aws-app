import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: ["Title is required"],
    },
    url: {
      type: String,
      trim: true,
      required: ["Url is required"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    type: {
      type: String,
      default: "Free",
    },
    medium: {
      type: String,
      default: "Video",
    },
    clicks: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Link", LinkSchema);
