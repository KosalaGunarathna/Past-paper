import express from "express";
import { 
    getPDFs, 
    getPDFById, 
    createPDF, 
    updatePDF, 
    deletePDF 
} from "../controllers/pdf.controller.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getPDFs);
router.get("/:id", getPDFById);
router.post("/", createPDF);
router.put("/:id", updatePDF);
router.delete("/:id", deletePDF);

export default router;
