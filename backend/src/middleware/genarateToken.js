import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const genarateToken = async (userId) => {
    try {
    const userData = await User.findById(userId);
        if(!userData){
            // user not found
            return { success: false, message: "User not found" };
        }

        const token = jwt.sign({ userId: userData._id, role: userData.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { success: true, token: token };
        
    } catch (error) {
        return { success: false, message: error.message };
    }
}