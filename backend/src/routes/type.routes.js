import express from "express";
import { getTypes, createType, updateType, deleteType } from "../controllers/type.controller.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getTypes);
router.post("/", createType);
router.put("/:id", updateType);
router.delete("/:id", deleteType);

export default router;
