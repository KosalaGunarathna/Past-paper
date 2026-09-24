import express from "express";
import { getLanguages, createLanguage, updateLanguage, deleteLanguage } from "../controllers/language.controller.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getLanguages);
router.post("/", createLanguage);
router.put("/:id", updateLanguage);
router.delete("/:id", deleteLanguage);

export default router;

