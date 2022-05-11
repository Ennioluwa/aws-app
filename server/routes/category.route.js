import categoryModel from "../models/category.model";
import express from "express";
import validator from "../validators/categoryValidator";
import run from "../validators/index";
import authController from "../controllers/auth.controller";
import categoryController from "../controllers/category.controller";

const router = express.Router();

router.post(
  "/category",
  validator.categoryCreateValidator,
  run.runValidation,
  authController.requireSignin,
  authController.isAdmin,
  categoryController.create
);
router.get("/categories", categoryController.list);
router
  .route("/category/:slug")
  .post(categoryController.read)
  .put(
    validator.categoryUpdateValidator,
    run.runValidation,
    authController.requireSignin,
    authController.isAdmin,
    categoryController.update
  )
  .delete(
    authController.requireSignin,
    authController.isAdmin,
    categoryController.remove
  );
export default router;
