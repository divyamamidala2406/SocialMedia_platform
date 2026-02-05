document.addEventListener("DOMContentLoaded", () => {
    const profileUser = document.getElementById("profileUser");
    const profilePic = document.getElementById("profilePic");
    const followersCount = document.getElementById("followersCount");
    const followBtn = document.getElementById("followBtn");

    const username = localStorage.getItem("user");
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    /* ================= LOAD PROFILE NAME ================= */
    const profileNames =
        JSON.parse(localStorage.getItem("profileNames")) || {};

    profileUser.textContent =
        profileNames[username] || username;

    /* ================= LOAD PROFILE IMAGE ================= */
    const profileImages =
        JSON.parse(localStorage.getItem("profileImages")) || {};

    profilePic.src =
        profileImages[username] || "default-man.png";

    /* ================= LOAD FOLLOW DATA ================= */
    const followersData =
        JSON.parse(localStorage.getItem("followersData")) || {};

    const followingData =
        JSON.parse(localStorage.getItem("followingData")) || {};

    followersCount.textContent =
        followersData[username] || 0;

    if (followingData[username]) {
        followBtn.textContent = "Following";
        followBtn.classList.add("following");
    }

    /* ================= PROFILE PIC UPLOAD ================= */
    const editPicBtn = document.getElementById("editPicBtn");
    const fileInput = document.getElementById("profileImageInput");

    editPicBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        if (!fileInput.files[0]) return;

        const reader = new FileReader();
        reader.onload = () => {
            profileImages[username] = reader.result;
            localStorage.setItem(
                "profileImages",
                JSON.stringify(profileImages)
            );
            profilePic.src = reader.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    });
});

/* ================= FOLLOW / UNFOLLOW ================= */
function toggleFollow() {
    const username = localStorage.getItem("user");
    const followersCount = document.getElementById("followersCount");
    const followBtn = document.getElementById("followBtn");

    let followersData =
        JSON.parse(localStorage.getItem("followersData")) || {};

    let followingData =
        JSON.parse(localStorage.getItem("followingData")) || {};

    let followers = followersData[username] || 0;

    if (!followingData[username]) {
        followers++;
        followingData[username] = true;
        followBtn.textContent = "Following";
        followBtn.classList.add("following");
    } else {
        followers--;
        followingData[username] = false;
        followBtn.textContent = "Follow";
        followBtn.classList.remove("following");
    }

    followersData[username] = followers;

    followersCount.textContent = followers;

    localStorage.setItem(
        "followersData",
        JSON.stringify(followersData)
    );
    localStorage.setItem(
        "followingData",
        JSON.stringify(followingData)
    );
}

/* ================= SAVE PROFILE ================= */
function saveProfile() {
    const username = localStorage.getItem("user");
    const nameInput = document.getElementById("nameInput").value.trim();

    let profileNames =
        JSON.parse(localStorage.getItem("profileNames")) || {};

    if (nameInput) {
        profileNames[username] = nameInput;
        localStorage.setItem(
            "profileNames",
            JSON.stringify(profileNames)
        );
        document.getElementById("profileUser").textContent = nameInput;
    }

    alert("Profile saved");
}

/* ================= REMOVE PROFILE PIC ================= */
function removeProfilePic() {
    const username = localStorage.getItem("user");

    let profileImages =
        JSON.parse(localStorage.getItem("profileImages")) || {};

    delete profileImages[username];
    localStorage.setItem(
        "profileImages",
        JSON.stringify(profileImages)
    );

    document.getElementById("profilePic").src = "default-man.png";
    alert("Profile picture removed");
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

/* ================= NAVIGATION ================= */
function goBack() {
    window.location.href = "home.html";
}