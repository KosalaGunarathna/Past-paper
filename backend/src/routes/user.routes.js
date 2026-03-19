import express from 'express';
import { getUsers,registerUser,deleteUser,updateUser,loginUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();


router.get("/", verifyToken, getUsers);
router.post("/", registerUser);
router.delete("/", deleteUser );
router.put("/:id",verifyToken, updateUser );
router.post("/login",loginUser);



export default router;