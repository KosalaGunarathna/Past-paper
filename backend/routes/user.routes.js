import express from 'express';

import { getUsers,registerUser,deleteUser,updateUser } from '../controllers/user.controller.js';

const router = express.Router();


router.get("/", getUsers);
router.post("/", registerUser);
router.delete("/",deleteUser );
router.put("/:id",updateUser );



export default router;