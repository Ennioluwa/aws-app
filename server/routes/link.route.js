import express from "express";
import linkModel from "../models/link.model";
import validator from "../validators/link.validator";
import run from "../validators/index";
import authController from "../controllers/auth.controller";
import linkController from "../controllers/link.controller";

const router = express.Router();

router.post(
  "/link/create",
  validator.linkCreateValidator,
  run.runValidation,
  authController.requireSignin,
  authController.isAdmin,
  linkController.create
);
router.get("/links", authController.requireSignin, linkController.list);
router
  .route("/link/:slug")
  .get(linkController.read)
  .put(
    validator.linkCreateValidator,
    run.runValidation,
    authController.requireSignin,
    authController.isAdmin,
    linkController.update
  )
  .delete(
    validator.linkCreateValidator,
    run.runValidation,
    authController.requireSignin,
    authController.isAdmin,
    linkController.remove
  );
router.put("/link-count", linkController.clicks);

export default router;
