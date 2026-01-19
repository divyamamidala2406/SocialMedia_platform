function login() {
    fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location = "home.html";
        } else {
            alert("Invalid login");
        }
    });
}

function loadPosts() {
    fetch("/posts")
        .then(res => res.json())
        .then(renderPosts);
}

function createPost() {
    fetch("/post", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: postText.value })
    })
    .then(res => res.json())
    .then(renderPosts);
    postText.value = "";
}

function likePost(i) {
    fetch("/like", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ index: i })
    })
    .then(res => res.json())
    .then(renderPosts);
}

function commentPost(i) {
    let comment = document.getElementById("c" + i).value;
    fetch("/comment", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ index: i, comment })
    })
    .then(res => res.json())
    .then(renderPosts);
}

function renderPosts(posts) {
    let html = "";
    posts.forEach((p, i) => {
        html += `
        <div class="post">
            <p>${p.text}</p>
            <button onclick="likePost(${i})">Like (${p.likes})</button>
            <input id="c${i}" placeholder="Comment">
            <button onclick="commentPost(${i})">Add</button>
            ${p.comments.map(c => `<p>💬 ${c}</p>`).join("")}
        </div>`;
    });
    document.getElementById("posts").innerHTML = html;
}