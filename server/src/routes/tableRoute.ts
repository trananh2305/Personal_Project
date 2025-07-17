import express from "express";
import {
  createTable,
  deleteTable,
  getAllTables,
  getTableById,
  updateTableStatus,
} from "../controllers/tableController";

const router = express.Router();

router.route("/").post(createTable);
router
  .route("/:id")
  .get(getTableById)
  .put(updateTableStatus)
  .delete(deleteTable);
router.route("/").get(getAllTables);

export default router;
