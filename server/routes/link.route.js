import express from "express";
import linkModel from "../models/link.model";
import validator from "../validators/link.validator";
import run from "../validators/index";
import authController from "../controllers/auth.controller";
import linkController from "../controllers/link.controller";

const router = express.Router();
router
  .route("/links/admin")
  .post(
    authController.requireSignin,
    authController.isAdmin,
    linkController.list
  );
router.get("/link/trending", linkController.trending);
router.put("/link/like/:id", authController.requireSignin, linkController.like);
router.put(
  "/link/unlike/:id",
  authController.requireSignin,
  linkController.unlike
);
router.post(
  "/link/create",
  validator.linkCreateValidator,
  run.runValidation,
  authController.requireSignin,
  authController.hasAuthentication,
  linkController.create
);
router.put("/link-count", linkController.clicks);
router
  .route("/link/:slug")
  .get(linkController.read)
  .put(
    validator.linkCreateValidator,
    run.runValidation,
    authController.requireSignin,
    authController.hasAuthentication,
    authController.isAuthorized,
    linkController.update
  )
  .delete(
    authController.requireSignin,
    authController.hasAuthentication,
    authController.isAuthorized,
    linkController.remove
  );

router
  .route("/link/admin/:slug")
  .put(
    validator.linkCreateValidator,
    run.runValidation,
    authController.requireSignin,
    authController.hasAuthentication,
    linkController.update
  )
  .delete(
    authController.requireSignin,
    authController.hasAuthentication,
    linkController.remove
  );
router.post("/link/filter/:slug", linkController.filter);
export default router;
