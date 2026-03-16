import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"; 
import userRoutes from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
 
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/api/users", userRoutes);


app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server is running on http://localhost:"+process.env.PORT);
} );


