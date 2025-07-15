import express from "express";
import {
  login,
  logout,
  newAccessToken,
  register,
  resetPassword,
} from "../controllers/userController";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refreshToken").post(newAccessToken);
router.route("/resetPassword").post(resetPassword); // Assuming resetPassword is also handled here

export default router;
