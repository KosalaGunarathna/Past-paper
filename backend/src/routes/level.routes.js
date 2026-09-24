import express from "express";
import { getLevels, createLevel, updateLevel, deleteLevel } from "../controllers/level.controller.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getLevels);
router.post("/", createLevel);
router.put("/:id", updateLevel);
router.delete("/:id", deleteLevel);

export default router;
