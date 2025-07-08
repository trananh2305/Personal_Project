import express from "express";
import userRoute from "./userRoute";

const router = express.Router();
// const validateTokenHandler = require("../middlewares/validaTokenHandler")

router.use("/user", userRoute);

export default router;
