function showLogin() {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("signupBox").style.display = "none";
}

function showSignup() {
    document.getElementById("signupBox").style.display = "block";
    document.getElementById("loginBox").style.display = "none";
}

function signup() {
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const warning = document.getElementById("signupWarning");

    if (!username || !password) {
        warning.textContent = "⚠️ Please fill all fields!";
        warning.style.display = "block";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(u => u.username === username);

    if (exists) {
        warning.textContent = "⚠️ Username already exists!";
        warning.style.display = "block";
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    warning.style.display = "none";
    alert("Account created successfully!");
    showLogin();
}

function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const warning = document.getElementById("warning");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.username === username);

    if (!user || user.password !== password) {
        warning.textContent = "⚠️ Wrong username or password!";
        warning.style.display = "block";
        return;
    }

    warning.style.display = "none";
    localStorage.setItem("user", username);
    window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", () => {
    showLogin();
});
