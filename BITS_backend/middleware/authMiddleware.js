const jwt = require("jsonwebtoken");
const SECRET_KEY = "bitsnpieces"; // Replace with a secure key

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        req.user = jwt.verify(token, SECRET_KEY); // Attach decoded user info to `req.user`
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).json({ error: "Invalid token." });
    }
};

module.exports = authMiddleware;
