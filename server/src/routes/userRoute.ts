import express from "express";
import { login, logout, newAccessToken, register } from "../controllers/userController";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refreshToken").post(newAccessToken);


export default router;
