import express from "express";
import userController from "../controllers/user.controller";

const router = express.Router();

router.route("/api/user").get(userController.userById);
router.route("/api/post").get(userController.postById);

export default router;
