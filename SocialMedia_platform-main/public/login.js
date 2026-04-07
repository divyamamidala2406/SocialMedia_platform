function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const warning = document.getElementById("warning");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        warning.textContent = "⚠️ Wrong username or password";
        warning.style.display = "block";
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "home.html";
}
