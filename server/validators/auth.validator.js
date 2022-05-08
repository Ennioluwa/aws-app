import { check } from "express-validator";

const userRegisterValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
const userLoginValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
const resetPasswordValidator = [
  check("token").not().isEmpty().withMessage("Token is required"),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
const forgotPasswordValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
];

export default {
  userRegisterValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
