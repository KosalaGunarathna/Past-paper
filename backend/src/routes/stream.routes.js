import express from "express";
import { getStreams, createStream, updateStream, deleteStream } from "../controllers/stream.controller.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getStreams);
router.post("/", createStream);
router.put("/:id", updateStream);
router.delete("/:id", deleteStream);

export default router;
