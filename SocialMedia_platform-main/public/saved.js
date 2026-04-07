document.addEventListener("DOMContentLoaded", () => {
    loadSavedPosts();
});

function loadSavedPosts() {
    const savedFeed = document.getElementById("savedFeed");
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

    savedFeed.innerHTML = "";

    if (savedPosts.length === 0) {
        savedFeed.innerHTML = "<p style='text-align:center;'>No saved posts yet ⭐</p>";
        return;
    }

    savedPosts.forEach((post, index) => {
        const div = document.createElement("div");
        div.className = "post";

        div.innerHTML = `
            <p>${post.text}</p>
            ${post.image ? `<img src="${post.image}" />` : ""}
            <button class="save-btn" onclick="unsavePost(${index})">🗑️ Unsave</button>
        `;

        savedFeed.appendChild(div);
    });
}

function unsavePost(index) {
    let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
    savedPosts.splice(index, 1); // remove that post

    localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
    loadSavedPosts(); // re-render
}

function goBack() {
    window.location.href = "home.html";
}
