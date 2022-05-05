import express from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";

const router = express.Router();

router
  .route("/api/user")
  .get(
    authController.requireSignin,
    authController.hasAuthentication,
    userController.read
  );
router
  .route("/api/admin")
  .get(
    authController.requireSignin,
    authController.isAdmin,
    userController.read
  );

export default router;
