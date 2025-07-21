import express from "express";
import {
  createDiscont,
  deleteDiscont,
  getAllDisconts,
  getDiscontById,
  updateDiscont,
} from "../controllers/discontController";

const router = express.Router();

router.route("/").post(createDiscont).get(getAllDisconts);
router
  .route("/:id")
  .get(getDiscontById)
  .delete(deleteDiscont)
  .put(updateDiscont);

export default router;
