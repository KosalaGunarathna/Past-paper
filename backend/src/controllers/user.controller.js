import User from "../models/user.model.js";
import mongoose from "mongoose";
import {genarateToken} from "../middleware/genarateToken.js";


export const getUsers = async (req, res) => {
    try {
        const user=await User.find({});
        res.status(200).json({ success: true, data: user });

    }catch (error){
        console.log("error find user ",error.message);
        res.status(200).json({ success: false, message:"Server error "});
    }
};

export const registerUser = async (req, res) => {
    const user = req.body;

    if (!user.username || !user.email || !user.password) {
        return res.status(400).json({ success: false,message: "All fields are required...." });
    }

    try {
        if(await User.findOne({ email: user.email })){
            return res.status(400).json({ success: false, message: "User already exists" });
        }    
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
        console.log("User created successfully");

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }

};

export const loginUser = async (req, res,next) => {
    const {email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        if (user.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = genarateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000 // 1 hour
       }).status(200).json({ success: true, message: "Login successful", user });
       next();
        
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    const userDetails = req.body;
    try {
        const user = await User.findOneAndDelete({ id: userDetails._id });
        
        res.status(200).json({
            status: 200,
            message: "User deleted successfully", 
            data: user

        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Server error.." });
    }

};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(200).json({success:true , message:"Invalid Product Id"});
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id,user,{new:true});
        return res.status(200).json({success:true , data:updatedUser});
    } catch (error) {
        return res.status(500).json({success:false , message:"Server error"});
    }

};
