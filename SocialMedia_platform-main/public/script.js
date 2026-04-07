console.log("SCRIPT CONNECTED");

/* ================= LOGIN ================= */
async function login() {
  const username = document.getElementById("loginUsername")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("username", data.user.username);
    window.location.href = "home.html";
  } else {
    alert(data.message);
  }
}


/* ================= SIGNUP ================= */
async function signup() {
  const username = document.getElementById("signupUsername")?.value.trim();
  const password = document.getElementById("signupPassword")?.value.trim();

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account created successfully!");
      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Server not reachable.");
  }
}


/* ================= CREATE POST ================= */
async function addPost() {
  const caption = document.querySelector("textarea")?.value.trim();
  const imageInput = document.getElementById("imageInput");
  const username = localStorage.getItem("username");

  if (!caption && !imageInput?.files[0]) {
    alert("Add caption or image!");
    return;
  }

  let imageBase64 = "";

  if (imageInput?.files[0]) {
    const reader = new FileReader();

    reader.onload = async function () {
      imageBase64 = reader.result;

      await fetch("http://localhost:5000/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          caption,
          image: imageBase64
        })
      });

      document.querySelector("textarea").value = "";
      imageInput.value = "";
      loadFeed();
    };

    reader.readAsDataURL(imageInput.files[0]);

  } else {
    await fetch("http://localhost:5000/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        caption,
        image: ""
      })
    });

    document.querySelector("textarea").value = "";
    loadFeed();
  }
}

/* ================= LOAD FEED ================= */
async function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const res = await fetch("http://localhost:5000/feed");
  const posts = await res.json();

  feed.innerHTML = "";

  posts.forEach(post => {
    feed.innerHTML += `
      <div class="post">

        <h3>${post.username}</h3>

        <p>${post.caption}</p>
        ${post.image ? `<img src="${post.image}" width="200"/>` : ""}

        <button onclick="likePost('${post._id}')">
          ❤️ ${post.likes.length}
        </button>

        <div style="margin-top:10px;">
          ${post.comments.map(c =>
            `
            <div class="comment">
              <span class="comment-user">${c.username}</span>
              <span class="comment-text">${c.text}</span>
            </div>
            `
          ).join("")}
        </div>

        <div class="comment-box">
          <input type="text" id="comment-${post._id}" placeholder="Add comment">
          <button onclick="addComment('${post._id}')">Comment</button>
        </div>

        ${
          post.username === localStorage.getItem("username")
            ? `<button class="delete-btn-small" onclick="deletePost('${post._id}')">🗑 Delete</button>`
            : ""
        }

      </div>
    `;
  });
}
/* ================= DELETE ================= */
async function deletePost(postId) {
  const username = localStorage.getItem("username");

  if (!confirm("Are you sure you want to delete this post?")) return;

  await fetch(`http://localhost:5000/delete/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  loadFeed();
}
/* ================= LIKE ================= */
async function likePost(postId) {
  const username = localStorage.getItem("username");

  await fetch(`http://localhost:5000/like/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  loadFeed();
}


/* ================= COMMENT ================= */
async function addComment(postId) {
  const username = localStorage.getItem("username");
  const text = document.getElementById(`comment-${postId}`)?.value.trim();

  if (!text) return;

  await fetch(`http://localhost:5000/comment/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, text })
  });

  loadFeed();
}


/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("username");
  window.location.href = "login.html";
}


/* ================= AUTO LOAD + IMAGE BUTTON ================= */
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("username");

  const cameraBtn = document.getElementById("cameraBtn");
  const imageInput = document.getElementById("imageInput");

  if (cameraBtn && imageInput) {
    cameraBtn.addEventListener("click", () => {
      imageInput.click();
    });
  }

  if (window.location.pathname.includes("home.html")) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    loadFeed();
  }
});