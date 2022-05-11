import { check } from "express-validator";

const linkCreateValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("url").not().isEmpty().withMessage("URL is required"),
  check("categories").not().isEmpty().withMessage("Pick a category"),
  check("type").not().isEmpty().withMessage("Pick a type, free/paid"),
  check("medium").not().isEmpty().withMessage("Pick a medium, video/book"),
];

export default { linkCreateValidator };
