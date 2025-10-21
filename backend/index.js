import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/user.model.js";
 
dotenv.config();
const app = express();
app.use(express.json());


app.post("/api/user", async(req, res) => {
//   res.send("Server is running...");
    const user = req.body;

    if(!user.username || !user.email || !user.password ) {
        return res.status(400).json({ message: "All fields are required...." });
    }
    try {
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });

    }catch(error) {
        console.error("Error saving user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
    console.log(user.body);
    res.status(201).json({ message: "User created successfully", user });

});



app.listen(5000, () => {
    connectDB();
    console.log("Server is running on http://localhost:5000");
} );


