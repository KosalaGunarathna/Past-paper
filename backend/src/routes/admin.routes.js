import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/stats", getAdminStats);

export default router;
