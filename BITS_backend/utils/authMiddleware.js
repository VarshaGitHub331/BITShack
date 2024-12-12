const jwt = require("jsonwebtoken");
const SECRET_KEY = "bitsnpieces"; // Use the same secret key

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access token missing" });
    }

    try {
        req.user = jwt.verify(token, SECRET_KEY); // Attach decoded user info to the request
        next();
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = authenticate;
