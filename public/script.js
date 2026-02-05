/* ================= TOGGLE LOGIN / SIGNUP ================= */
function showLogin() {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("signupBox").style.display = "none";
}

function showSignup() {
    document.getElementById("signupBox").style.display = "block";
    document.getElementById("loginBox").style.display = "none";
}

/* ================= SIGNUP ================= */
function signup() {
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const warning = document.getElementById("signupWarning");

    if (!username || !password) {
        warning.textContent = "⚠️ Fill all fields!";
        warning.style.display = "block";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.username === username)) {
        warning.textContent = "⚠️ Username already exists!";
        warning.style.display = "block";
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Account created! Please login.");
    showLogin();
}

/* ================= LOGIN ================= */
function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const warning = document.getElementById("warning");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        warning.textContent = "⚠️ Wrong username or password!";
        warning.style.display = "block";
        return;
    }

    localStorage.setItem("user", username);
    window.location.href = "home.html";
}

/* ================= DOM LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {

    const loggedUser = localStorage.getItem("user");

    // Auth protection
    if (!loggedUser && window.location.pathname.includes("home.html")) {
        window.location.href = "login.html";
        return;
    }

    // Default login view
    if (document.getElementById("loginBox")) {
        showLogin();
    }

    // Show username
    const userSpan = document.getElementById("user");
    if (userSpan) {
        userSpan.textContent = loggedUser || "User";
    }

    /* ================= PROFILE ICON ================= */
    const profileIcon = document.getElementById("profileIcon");
    if (profileIcon && loggedUser) {
        let profileImages =
            JSON.parse(localStorage.getItem("profileImages")) || {};

        profileIcon.src =
            profileImages[loggedUser] || "default-man.png";
    }

    /* ================= IMAGE PREVIEW BEFORE POST ================= */
    const cameraBtn = document.getElementById("cameraBtn");
    const imageInput = document.getElementById("imageInput");

    if (cameraBtn && imageInput) {
        cameraBtn.addEventListener("click", () => imageInput.click());

        imageInput.addEventListener("change", () => {
            if (!imageInput.files[0]) return;

            // remove old preview
            const oldPreview = document.getElementById("imagePreview");
            if (oldPreview) oldPreview.remove();

            const img = document.createElement("img");
            img.id = "imagePreview";
            img.src = URL.createObjectURL(imageInput.files[0]);
            img.style.width = "120px";
            img.style.height = "120px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "10px";
            img.style.marginTop = "10px";

            document.querySelector(".camera-box").appendChild(img);

            cameraBtn.style.display = "none";
        });
    }

    if (window.location.pathname.includes("home.html")) {
        loadPosts();
    }
});

/* ================= ADD POST ================= */
function addPost() {
    const text = document.querySelector("textarea").value.trim();
    const imageInput = document.getElementById("imageInput");
    const username = localStorage.getItem("user");

    if (!text && !imageInput.files[0]) {
        alert("Write something or add an image!");
        return;
    }

    let posts = JSON.parse(localStorage.getItem("posts")) || {};
    if (!posts[username]) posts[username] = [];

    posts[username].push({
        text,
        image: imageInput.files[0]
            ? URL.createObjectURL(imageInput.files[0])
            : null
    });

    localStorage.setItem("posts", JSON.stringify(posts));

    // reset inputs
    document.querySelector("textarea").value = "";
    imageInput.value = "";

    // remove preview & restore button
    const preview = document.getElementById("imagePreview");
    if (preview) preview.remove();
    document.getElementById("cameraBtn").style.display = "inline-block";

    loadPosts();
}

/* ================= LOAD POSTS (ONLY OWN POSTS HAVE DELETE) ================= */
function loadPosts() {
    const username = localStorage.getItem("user");
    const container = document.querySelector(".container");

    document.querySelectorAll(".post").forEach(p => p.remove());

    let posts = JSON.parse(localStorage.getItem("posts")) || {};
    let userPosts = posts[username] || [];

    userPosts.forEach((postData, index) => {
        const post = document.createElement("div");
        post.className = "post";

        post.innerHTML = `
            <div class="post-header">
                <strong>${username}</strong>
                <button class="delete-btn" onclick="deletePost(${index})">
                    Delete
                </button>
            </div>

            <p>${postData.text}</p>
            ${postData.image ? `<img src="${postData.image}" />` : ""}

            <div class="reactions">
                <button onclick="react(this)">👍 <span>0</span></button>
                <button onclick="react(this)">❤️ <span>0</span></button>
                <button onclick="react(this)">😂 <span>0</span></button>
            </div>

            <div class="comments-section">
                <input type="text" placeholder="Write a comment..." />
                <button onclick="addComment(this)">Post</button>
                <div class="comments"></div>
            </div>

            <button class="save-btn" onclick="savePost(this)">⭐ Save</button>
        `;

        container.appendChild(post);
    });
}

/* ================= DELETE POST ================= */
function deletePost(index) {
    const username = localStorage.getItem("user");
    let posts = JSON.parse(localStorage.getItem("posts")) || {};

    if (!posts[username]) return;
    if (!confirm("Delete this post?")) return;

    posts[username].splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));

    loadPosts();
}

/* ================= REACTIONS ================= */
function react(btn) {
    const span = btn.querySelector("span");
    span.textContent = Number(span.textContent) + 1;
}

/* ================= COMMENTS ================= */
function addComment(btn) {
    const input = btn.previousElementSibling;
    const text = input.value.trim();
    if (!text) return;

    const commentsDiv = btn.nextElementSibling;
    const username = localStorage.getItem("user");

    const comment = document.createElement("p");
    comment.innerHTML = `<strong>${username}</strong>: ${text}`;

    commentsDiv.appendChild(comment);
    input.value = "";
}

/* ================= SAVE POST ================= */
function savePost(btn) {
    const post = btn.parentElement;
    const text = post.querySelector("p")?.innerHTML || "";
    const img = post.querySelector("img");

    let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

    if (savedPosts.some(p => p.text === text)) {
        showToast("Already saved ⭐");
        return;
    }

    savedPosts.push({
        text,
        image: img ? img.src : null
    });

    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
    showToast("Post saved ⭐");
}

/* ================= NAVIGATION ================= */
function goToSaved() {
    window.location.href = "saved.html";
}

function goToProfile() {
    window.location.href = "profile.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

/* ================= TOAST ================= */
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 2000);
}