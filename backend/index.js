import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
 
dotenv.config();
const app = express();
app.use(express.json());


app.use("/api/user", userRoutes);





app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server is running on http://localhost:"+process.env.PORT);
} );


