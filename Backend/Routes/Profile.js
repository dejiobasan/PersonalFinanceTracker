const router = require("express").Router();
const { protectRoute } = require("../Middleware/authMiddleware");
const user = require("../Models/User");

// Get user profile
router.get("/getProfile", protectRoute, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
});

module.exports = router;