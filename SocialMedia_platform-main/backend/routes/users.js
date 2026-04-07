const express = require("express");
const User = require("../models/user");

const router = express.Router();

// SEARCH USERS
router.get("/search", async (req, res) => {
  const query = req.query.q;
  const currentUserId = req.query.userId;

  if (!query) return res.json([]);

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // case-insensitive
      _id: { $ne: currentUserId }                 // exclude self
    }).select("_id username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
});

module.exports = router;
