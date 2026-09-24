import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";

// Routes
import userRoutes from "./src/routes/user.routes.js";
import subjectRoutes from "./src/routes/subject.routes.js";
import levelRoutes from "./src/routes/level.routes.js";
import streamRoutes from "./src/routes/stream.routes.js";
import typeRoutes from "./src/routes/type.routes.js";
import pdfRoutes from "./src/routes/pdf.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import languageRoutes from "./src/routes/language.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Route Declarations
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/streams", streamRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/mediums", languageRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/admin", adminRoutes);


// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "PastPapers.lk API is live" });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
