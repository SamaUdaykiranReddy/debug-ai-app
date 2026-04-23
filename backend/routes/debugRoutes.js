import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createDebug,
  getDebugs,
  deleteDebug,
  solveDebugWithAi,
  applyFixAi,
} from "../controllers/debugController.js";

const router = express.Router();

router.post("/", protect, createDebug);
router.get("/", protect, getDebugs);
router.delete("/:id", protect, deleteDebug);
router.post("/:id/solve", protect, solveDebugWithAi);
router.post("/:id/fix", protect, applyFixAi);

export default router;