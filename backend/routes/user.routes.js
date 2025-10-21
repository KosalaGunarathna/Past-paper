import express from 'express';
import User from '../models/user.model.js';
import mongoose from 'mongoose';


const router = express.Router();


router.post("/registration", async (req, res) => {
    const user = req.body;

    if (!user.username || !user.email || !user.password) {
        return res.status(400).json({ message: "All fields are required...." });
    }

    try {
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
    console.log(user.body);
    res.status(201).json({ message: "User created successfully", user });

});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
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

});

router.put("/update/:id", async (req, res) => {
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

});

router.get("/getAllUser", async (req, res) => {
    try {
        const user=await User.find({});
        res.status(200).json({ success: true, data: user });

    }catch (error){
        console.log("error find user ",error.message);
        res.status(200).json({ success: false, message:"Server error "});
    }
});



export default router;