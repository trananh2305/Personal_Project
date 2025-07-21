import express from "express";
import userRoute from "./userRoute";
import dishRoute from "./dishRoute";
import categoryRoute from "./categoryRoute";
import { upload } from "../middlewares/upload";
// import { validateToken } from "../middlewares/verifyAuthen";
import tableRoute from "./tableRoute";
import orderRoute from "./orderRoute";
import kitchenRoute from "./kitchenRoute";
import discountRoute from "./discountRoute";
import billRoute from "./billRoute"

const router = express.Router();

router.use("/user", userRoute);
router.use("/dish", upload.single("image"), dishRoute);
router.use("/category", categoryRoute);
router.use("/table", tableRoute);
router.use("/order", orderRoute);
router.use("/kitchen",kitchenRoute);
router.use("/discount",discountRoute)
router.use("/bill",billRoute)

export default router;
