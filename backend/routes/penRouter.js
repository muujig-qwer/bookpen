import express from "express";
import {
  createPen,
  getAllPens,
  getPenById,
  updatePen,
  deletePen,
} from "../controller/penController.js";

const router = express.Router();

router.post("/", createPen);
router.get("/", getAllPens);
router.get("/:id", getPenById);
router.put("/:id", updatePen);
router.delete("/:id", deletePen);

export default router;