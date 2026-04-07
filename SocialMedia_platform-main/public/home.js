document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("user").textContent = user.username;

    /* ================= PROFILE ICON ================= */
    const profileImages =
        JSON.parse(localStorage.getItem("profileImages")) || {};

    const profileIcon = document.getElementById("profileIcon");
    if (profileIcon && profileImages[user.username]) {
        profileIcon.src = profileImages[user.username];
    }

    /* ================= IMAGE UPLOAD ================= */
    const cameraBtn = document.getElementById("cameraBtn");
    const imageInput = document.getElementById("imageInput");

    let selectedImage = "";

    cameraBtn.addEventListener("click", () => {
        imageInput.click(); // open file picker
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            selectedImage = reader.result;
            showToast("Image selected ✅");
        };
        reader.readAsDataURL(file);
    });

    /* ================= ADD POST ================= */
    window.addPost = function () {
        const textarea = document.querySelector("textarea");
        const text = textarea.value.trim();

        if (!text && !selectedImage) {
            showToast("Write something or add image!");
            return;
        }

        let posts = JSON.parse(localStorage.getItem("posts")) || {};

        if (!posts[user.username]) {
            posts[user.username] = [];
        }

        posts[user.username].push({
            text: text,
            image: selectedImage,
            date: new Date()
        });

        localStorage.setItem("posts", JSON.stringify(posts));

        textarea.value = "";
        selectedImage = "";
        imageInput.value = "";

        showToast("Post added successfully 🎉");
    };

    /* ================= SEARCH FUNCTION ================= */
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        searchResults.innerHTML = "";

        users.forEach(u => {
            if (u.username.toLowerCase().includes(query)) {
                const div = document.createElement("div");
                div.className = "result-item";
                div.textContent = u.username;

                div.onclick = () => {
                    localStorage.setItem("viewProfile", u.username);
                    window.location.href = "profile.html";
                };

                searchResults.appendChild(div);
            }
        });
    });

});

/* ================= PROFILE PAGE ================= */
function goToProfile() {
    localStorage.removeItem("viewProfile");
    window.location.href = "profile.html";
}

/* ================= TOAST MESSAGE ================= */
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2000);
}
