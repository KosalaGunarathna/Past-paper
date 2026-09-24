import express from "express";
import { 
    getUsers, 
    registerUser, 
    loginUser, 
    updateUser, 
    updateUserRole, 
    deleteUser 
} from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// Public auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/", registerUser); // legacy fallback

// Self profile update
router.put("/profile/:id", verifyToken, updateUser);

// User management routes
router.get("/", getUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);
router.delete("/", deleteUser);

export default router;