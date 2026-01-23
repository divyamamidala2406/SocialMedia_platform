function login() {
    const username = document.querySelector("input[type='text']").value;
    const password = document.querySelector("input[type='password']").value;

    const correctUsername = "Divya";
    const correctPassword = "Divya123";

        const warning = document.getElementById("warning");

    if (username !== correctUsername || password !== correctPassword) {
        warning.textContent = "⚠️ Wrong username or password!";
        warning.style.display = "block";
        return;
    }

    warning.style.display = "none";
    localStorage.setItem("user", username);
    window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const userSpan = document.getElementById("user");
    if (userSpan) {
        userSpan.textContent = localStorage.getItem("user") || "User";
    }

    const cameraBtn = document.getElementById("cameraBtn");
    const imageInput = document.getElementById("imageInput");

    if (cameraBtn && imageInput) {
        cameraBtn.addEventListener("click", () => {
            imageInput.click();
        });

        // ⭐️ IMAGE PREVIEW CODE ⭐️
        imageInput.addEventListener("change", () => {
            if (imageInput.files && imageInput.files[0]) {

                // Create a preview image
                const img = document.createElement("img");
                img.src = URL.createObjectURL(imageInput.files[0]);
                img.style.width = "100px";
                img.style.height = "100px";
                img.style.borderRadius = "10px";
                img.style.objectFit = "cover";

                // Replace button with image preview
                cameraBtn.style.display = "none";
                document.querySelector(".camera-box").appendChild(img);
            }
        });
    }
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

function timeText(date) {
    const minutes = Math.floor((Date.now() - date) / 60000);
    return minutes < 1 ? "Just now" : `${minutes} min ago`;
}

function addPost() {
    const text = document.querySelector("textarea").value;
    const imageInput = document.getElementById("imageInput");

    if (!text) {
        showToast("Write something first!");
        return;
    }

    const post = document.createElement("div");
    post.className = "post";

    const time = new Date();

    let imageHTML = "";
    if (imageInput.files[0]) {
        imageHTML = `<img src="${URL.createObjectURL(imageInput.files[0])}">`;
    }

    post.innerHTML = `
        <p>${text}</p>
        ${imageHTML}
        <p class="time">${timeText(time)}</p>

        <div class="reactions">
            <button onclick="react(this)">👍 <span data-count="0">0</span></button>
            <button onclick="react(this)">❤️ <span data-count="0">0</span></button>
            <button onclick="react(this)">😂 <span data-count="0">0</span></button>
            <button onclick="react(this)">😮 <span data-count="0">0</span></button>
            <button onclick="react(this)">😢 <span data-count="0">0</span></button>
        </div>

        <button class="save-btn" onclick="savePost(this)">⭐ Save</button>
    `;

    document.querySelector(".container").appendChild(post);

    document.querySelector("textarea").value = "";
    imageInput.value = "";

    showToast("Post uploaded!");
}

function react(btn) {
    const span = btn.querySelector("span");
    let count = Number(span.getAttribute("data-count") || span.textContent || 0);
    count++;
    span.setAttribute("data-count", count);
    span.textContent = count;
}

function savePost(btn) {
    const postClone = btn.parentElement.cloneNode(true);

    postClone.querySelectorAll("span").forEach(span => {
        span.textContent = "0";
        span.setAttribute("data-count", 0);
    });

    document.getElementById("savedPosts").appendChild(postClone);
    showToast("Post saved!");
}