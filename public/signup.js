function signup() {
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const msg = document.getElementById("msg");

    if (!username || !password) {
        msg.textContent = "⚠️ Fill all fields";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.username === username)) {
        msg.textContent = "⚠️ Username already exists";
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Account created! Please login.");
    window.location.href = "login.html";
}