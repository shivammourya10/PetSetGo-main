import jwt from "jsonwebtoken"
import User from "../models/User/UserSchema.js"

const verifyJwt = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header is missing or improperly formatted" });
        }

        const token = authHeader.replace("Bearer ", "");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decodedToken.id).select('-password'); // Don't include password
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Verify token matches stored token
        if (user.AccessToken !== token) {
            return res.status(401).json({ message: "Token mismatch - please login again" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        console.error("Error verifying JWT:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export default verifyJwt;