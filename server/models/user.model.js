import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: ["Name is required"],
      trim: true,
      max: 12,
      index: true,
      lowercase: true,
      max: 12,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      required: ["Email is required"],
      unique: ["Email already in use"],
      lowercase: true,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: ["Password is required"],
    },
    salt: String,
    role: {
      type: String,
      default: "Subscriber",
    },
    resetPasswordLink: {
      data: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      crypto.createHmac("sha256", this.salt).update(password).digest("hex");
    } catch (error) {
      return "";
    }
  },
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random() + "");
  },
};

const User = mongoose.model("User", userSchema);

export default User;