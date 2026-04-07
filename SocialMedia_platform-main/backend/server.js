const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
/* ================= MONGODB CONNECTION ================= */
mongoose.connect(
  "mongodb+srv://Vaarsh:vaarsh123@vaarshhh.7blaiei.mongodb.net/vibeloop?retryWrites=true&w=majority"
)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ================= USER SCHEMA ================= */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", UserSchema);

/* ================= POST SCHEMA ================= */

const CommentSchema = new mongoose.Schema({
  username: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  caption: String,
  image: String,

  likes: [
    {
      type: String
    }
  ],

  comments: [CommentSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", PostSchema);

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= CREATE POST ================= */
app.post("/create-post", async (req, res) => {
  try {
    const { username, caption, image } = req.body;

    const newPost = new Post({
      username,
      caption,
      image,
      likes: [],
      comments: []
    });

    await newPost.save();

    res.json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= GLOBAL FEED ================= */
app.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= GET POSTS BY USER ================= */
app.get("/posts/:username", async (req, res) => {
  try {
    const posts = await Post.find({
      username: req.params.username
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= LIKE POST ================= */
app.put("/like/:postId", async (req, res) => {
  try {
    const { username } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes.includes(username)) {
      post.likes.push(username);
    } else {
      post.likes = post.likes.filter(user => user !== username);
    }

    await post.save();
    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= ADD COMMENT ================= */
app.post("/comment/:postId", async (req, res) => {
  try {
    const { username, text } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      username,
      text
    });

    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/* ================= DELETE POST ================= */
app.delete("/delete/:postId", async (req, res) => {
  try {
    const { username } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only allow owner to delete
    if (post.username !== username) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= SERVE FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

/* ================= START SERVER ================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});