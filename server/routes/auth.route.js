import express from "express";
import authController from "../controllers/auth.controller";
import register from "../validators/auth.validator";
import run from "../validators";
const router = express.Router();

router
  .route("/api/register")
  .post(
    register.userRegisterValidator,
    run.runValidation,
    authController.register
  );
router.route("/api/activate").post(authController.activate);
router.route("/api/login").post(authController.login);
router.route("/api/logout").get(authController.logout);
router.route("/api/auth/password").post(authController.reset);
router.route("/api/password/reset").post(authController.resetPassword);

export default router;
