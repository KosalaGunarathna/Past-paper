import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
    let token = req.cookies?.token;

    // Also check Authorization Bearer header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized token or not valid" });
        }
        req.user = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// 🔒 Admin-only access middleware
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.role === "admin") {
            next();
        } else {
            return res.status(403).json({ 
                success: false, 
                message: "Access forbidden. Admin privileges required." 
            });
        }
    });
};