import User from "../models/user.model.js";
import mongoose from "mongoose";
import { generateToken } from "../middleware/genarateToken.js";

// @desc Get all users (Admin only)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error("Error finding users:", error);
        res.status(500).json({ success: false, message: "Server error fetching users" });
    }
};

// @desc Register user (Default role: user)
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required (username, email, password)" });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: "Email is already registered. Please login instead." 
            });
        }

        // 🔒 Enforce role: 'user' so normal registrations can never set themselves as admin
        const newUser = new User({
            username: username.trim(),
            email: normalizedEmail,
            password,
            role: "user"
        });

        await newUser.save();
        
        const token = await generateToken(newUser._id);
        const userObj = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000 * 24 // 24 hours
        }).status(201).json({ 
            success: true, 
            message: "User registered successfully", 
            user: userObj,
            token
        });

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ success: false, message: "Server Error during registration" });
    }
};

// @desc Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email/Username and password are required" });
    }

    try {
        const identifier = email.trim();
        // Support login by email OR username
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier }
            ]
        });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found. No account registered with this email/username." 
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: "Incorrect password. Please try again." 
            });
        }

        const token = await generateToken(user._id);

        const userObj = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000 * 24 // 24 hours
        }).status(200).json({ 
            success: true, 
            message: "Login successful", 
            user: userObj,
            token
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Server Error during login" });
    }
};

// @desc Update user role (🔒 Admin Only)
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid role. Role must be 'user' or 'admin'" 
        });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: `User role changed to '${role}' successfully`, 
            data: updatedUser 
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ success: false, message: "Failed to update user role" });
    }
};

// @desc Delete user (🔒 Admin Only)
export const deleteUser = async (req, res) => {
    const userId = req.params.id || req.body._id;

    try {
        const deleted = await User.findByIdAndDelete(userId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deleted
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ success: false, message: "Server error deleting user" });
    }
};

// @desc Update user profile (for logged in user)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        // Prevent regular users from modifying their role here
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { username }, 
            { new: true }
        ).select("-password");

        return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
