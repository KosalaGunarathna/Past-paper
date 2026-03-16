import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    // console.log("Token from cookie: ", token);
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized token or not valid" });
        }
        req.user = decoded.userId;
        req.role = decoded.role;
        console.log("verify token: ");
        next();
        
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}