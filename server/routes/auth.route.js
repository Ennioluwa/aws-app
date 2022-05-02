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

export default router;
