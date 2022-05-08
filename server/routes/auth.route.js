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
router
  .route("/api/login")
  .post(register.userLoginValidator, run.runValidation, authController.login);
router.route("/api/logout").get(authController.logout);
router
  .route("/api/forgot-password")
  .put(
    register.forgotPasswordValidator,
    run.runValidation,
    authController.forgotPassword
  );
router
  .route("/api/reset-password")
  .put(
    register.resetPasswordValidator,
    run.runValidation,
    authController.resetPassword
  );

export default router;
