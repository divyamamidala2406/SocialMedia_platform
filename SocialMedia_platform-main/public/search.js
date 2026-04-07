function searchUser() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const filtered = users.filter(u => u.username.toLowerCase().includes(query));

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    filtered.forEach(u => {
        const div = document.createElement("div");
        div.className = "user-card";
        div.innerHTML = `<p>${u.username}</p>`;
        resultDiv.appendChild(div);
    });
}
