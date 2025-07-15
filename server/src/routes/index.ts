import express from "express";
import userRoute from "./userRoute";
import dishRoute from "./dishRoute";
import categoryRoute from "./categoryRoute";    
import { upload } from "../middlewares/upload";
import { validateToken } from "../middlewares/verifyAuthen";

const router = express.Router();

router.use("/user", userRoute);
router.use("/dish",upload.single("image"), dishRoute);
router.use("/category", validateToken, categoryRoute);

export default router;
