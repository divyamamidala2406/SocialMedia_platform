const express = require("express");
const app = express();
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});


app.use(express.json());
app.use(express.static("public"));

let posts = [];

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "user" && password === "1234") {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get("/posts", (req, res) => {
    res.json(posts);
});

app.post("/post", (req, res) => {
    posts.unshift({
        text: req.body.text,
        likes: 0,
        comments: []
    });
    res.json(posts);
});

app.post("/like", (req, res) => {
    posts[req.body.index].likes++;
    res.json(posts);
});

app.post("/comment", (req, res) => {
    posts[req.body.index].comments.push(req.body.comment);
    res.json(posts);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});