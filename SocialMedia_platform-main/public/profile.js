document.addEventListener("DOMContentLoaded", () => {
  const loggedUser = localStorage.getItem("user");
  const viewUser = localStorage.getItem("viewProfile") || loggedUser;

  /* ================= USERNAME ================= */
  const profileUser = document.getElementById("profileUser");
  if (profileUser) profileUser.textContent = viewUser;

  /* ================= PROFILE PIC ================= */
  const profilePic = document.getElementById("profilePic");
  const profileImages =
    JSON.parse(localStorage.getItem("profileImages")) || {};

  if (profilePic) {
    profilePic.src = profileImages[viewUser] || "default-man.png";
  }

  /* ================= FOLLOW DATA ================= */
  let followers =
    JSON.parse(localStorage.getItem("followers")) || {};
  let following =
    JSON.parse(localStorage.getItem("following")) || {};

  followers[viewUser] = followers[viewUser] || [];
  following[loggedUser] = following[loggedUser] || [];

  document.getElementById("followersCount").textContent =
    followers[viewUser].length;

  document.getElementById("followingCount").textContent =
    following[viewUser]?.length || 0;

  /* ================= OWNER CONTROLS ================= */
  const ownerControls = document.getElementById("ownerControls");

if (ownerControls) {
  if (viewUser === loggedUser) {
    ownerControls.style.display = "block";
  } else {
    ownerControls.style.display = "none";
  }
}

  /* ================= FOLLOW BUTTON ================= */
  const header = document.querySelector(".profile-header");

  if (viewUser !== loggedUser && header) {
    // remove old button if exists
    const oldBtn = document.querySelector(".follow-btn");
    if (oldBtn) oldBtn.remove();

    const followBtn = document.createElement("button");
    followBtn.className = "follow-btn";

    const isFollowing = followers[viewUser].includes(loggedUser);
    followBtn.textContent = isFollowing ? "Following" : "Follow";

    followBtn.onclick = () => {
      if (followers[viewUser].includes(loggedUser)) {
        // UNFOLLOW
        followers[viewUser] = followers[viewUser].filter(
          u => u !== loggedUser
        );
        following[loggedUser] = following[loggedUser].filter(
          u => u !== viewUser
        );
        followBtn.textContent = "Follow";
      } else {
        // FOLLOW
        followers[viewUser].push(loggedUser);
        following[loggedUser].push(viewUser);
        followBtn.textContent = "Following";
      }

      localStorage.setItem("followers", JSON.stringify(followers));
      localStorage.setItem("following", JSON.stringify(following));

      document.getElementById("followersCount").textContent =
        followers[viewUser].length;
    };

    header.appendChild(followBtn);
  }

  /* ================= LOAD POSTS ================= */
  if (typeof loadUserPosts === "function") {
    loadUserPosts(viewUser);
  }

  /* ================= PROFILE PIC UPLOAD (OWNER ONLY) ================= */
  const editPicBtn = document.getElementById("editPicBtn");
  const fileInput = document.getElementById("profileImageInput");

  if (editPicBtn && fileInput && viewUser === loggedUser) {
    editPicBtn.onclick = () => fileInput.click();

    fileInput.onchange = () => {
      if (!fileInput.files[0]) return;

      const reader = new FileReader();
      reader.onload = () => {
        profileImages[loggedUser] = reader.result;
        localStorage.setItem(
          "profileImages",
          JSON.stringify(profileImages)
        );
        profilePic.src = reader.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    };
  }
});

/* ================= SAVE PROFILE ================= */
function saveProfile() {
  const username = localStorage.getItem("user");
  const nameInput = document.getElementById("nameInput")?.value.trim();

  if (!nameInput) return;

  let profileNames =
    JSON.parse(localStorage.getItem("profileNames")) || {};

  profileNames[username] = nameInput;
  localStorage.setItem(
    "profileNames",
    JSON.stringify(profileNames)
  );

  document.getElementById("profileUser").textContent = nameInput;
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
  localStorage.removeItem("viewProfile");
  window.location.href = "login.html";
}

/* ================= NAVIGATION ================= */
function goBack() {
  window.location.href = "home.html";
}
