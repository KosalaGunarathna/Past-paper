import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = async (userId) => {
    console.log("Generating token for userId: ", userId);
    try {
        if (!process.env.JSON_WEB_TOKEN) {
            throw new Error("JSON_WEB_TOKEN is not defined");
        }

        const userData = await User.findById(userId);
        console.log("User data for token generation: ", userData);

        if (!userData) {
            return { success: false, message: "User not found" };
        }

        const token = jwt.sign(
            { userId: userData._id, role: userData.role },
            process.env.JSON_WEB_TOKEN,
            { expiresIn: "30d" }
        );

        console.log("Generated token: ", token);

        return token;

    } catch (error) {
        console.error("Token generation error:", error);
        return { success: false, message: error.message };
    }
};