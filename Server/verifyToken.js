const jwt = require("jsonwebtoken");
const User = require("./models/UserModel");

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json("You are not authenticated!");
    }

    try {
        // ✅ Decode the token to get user ID
        const decoded = jwt.verify(token, process.env.SECRET);

        // ✅ Fetch user from DB using decoded ID
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json("User not found!");
        }

        req.userId = user._id;
        req.userRole = user.role;
        next();
    } catch (err) {
        return res.status(403).json("Token is not valid!");
    }
};

// ✅ Verify Admin Middleware
const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== "admin") {
            return res.status(403).json("Access denied! Admins only.");
        }
        next();
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { verifyToken, verifyAdmin };
