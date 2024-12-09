import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFO4eVxwUJ-28HoD7Q13AaLxYBYHD4sBk",
  authDomain: "catsimul.firebaseapp.com",
  projectId: "catsimul",
  storageBucket: "catsimul.firebasestorage.app",
  messagingSenderId: "82898723961",
  appId: "1:82898723961:web:ce2a076172c472e1f020a8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// DOM Elements
const authButton = document.getElementById("auth-button");
const loginModal = document.getElementById("login-modal");
const closeButton = document.querySelector(".close-button");
const googleLoginButton = document.getElementById("google-login");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginSubmitButton = document.getElementById("login-submit");
const loginMethodChangeButton = document.getElementById("login-method-change");
const loginText = document.getElementById("login-text");
const userProfile = document.getElementById("user-profile");
const userNameDisplay = document.getElementById("user-name");
const profileImage = document.getElementById("profile-image");
const logoutButton = document.getElementById("logout-btn");

let isLoginMode = true;

async function saveGameData(userId, gameData) {
  try {
    await setDoc(doc(db, "users", userId, "gameData", "catSimulation"), {
      hunger: gameData.hunger,
      happiness: gameData.happiness,
      cleanliness: gameData.cleanliness,
      love: gameData.love,
      timestamp: new Date(),
    });
    console.log("Game data saved successfully");
  } catch (error) {
    console.error("Error saving game data:", error);
  }
}

async function loadGameData(userId) {
  try {
    const docRef = doc(db, "users", userId, "gameData", "catSimulation");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const gameData = docSnap.data();
      return {
        hunger: gameData.hunger,
        happiness: gameData.happiness,
        cleanliness: gameData.cleanliness,
        love: gameData.love,
      };
    } else {
      console.log("No saved game data found");
      return null;
    }
  } catch (error) {
    console.error("Error loading game data:", error);
    return null;
  }
}

// Google Login
googleLoginButton.addEventListener("click", () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log("Google 로그인 성공:", result.user);
      loginModal.style.display = "none";
    })
    .catch((error) => {
      console.error("Google 로그인 실패:", error.message);
      alert("로그인 실패: " + error.message);
    });
});

// Email/Password Login or Signup
loginSubmitButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  const username = usernameInput.value;

  if (isLoginMode) {
    // Login
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("로그인 성공:", userCredential.user);
        loginModal.style.display = "none";
      })
      .catch((error) => {
        console.error("로그인 실패:", error.message);
        alert("로그인 실패: " + error.message);
      });
  } else {
    // Signup
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: username,
        }).then(() => user);
      })
      .then((user) => {
        console.log("회원가입 성공:", user);
        loginModal.style.display = "none";
      })
      .catch((error) => {
        console.error("회원가입 실패:", error.message);
        alert("회원가입 실패: " + error.message);
      });
  }
});

// Logout
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("로그아웃 성공");
    })
    .catch((error) => {
      console.error("로그아웃 실패:", error);
    });
});

// Auth State Listener
onAuthStateChanged(auth, async (user) => {
  // 전체 body에 로그인 상태 클래스 추가
  document.body.classList.toggle("logged-in", !!user);
  document.body.classList.toggle("logged-out", !user);
  const gameFrame = document.getElementById("game-frame");
  const noGameDiv = document.querySelector(".noGame");
  const gameDiv = document.querySelector(".Game");
  if (user) {
    // 로그인 상태일 때
    const displayName = user.displayName || "사용자";
    userNameDisplay.textContent = displayName;

    // 프로필 이미지 설정
    if (user.photoURL) {
      profileImage.src = user.photoURL;
    } else {
      // 기본 검정 배경 프로필 이미지
      profileImage.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="black"><rect width="40" height="40" fill="black"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16">' +
        displayName.charAt(0).toUpperCase() +
        "</text></svg>";
    }
  } else {
    // 로그아웃 상태일 때
    userNameDisplay.textContent = "";
    profileImage.src = "";
  }
  if (user) {
    // 로그인 상태일 때
    authButton.style.display = "none";
    userProfile.style.display = "flex";
    // User is logged in
    noGameDiv.style.display = "none";
    gameDiv.style.display = "flex";
    gameFrame.style.display = "flex";

    // Attempt to load saved game data
    const savedGameData = await loadGameData(user.uid);
    if (savedGameData) {
      // Send saved data to game iframe
      gameFrame.contentWindow.postMessage(
        {
          type: "LOAD_GAME_DATA",
          data: savedGameData,
        },
        "*"
      );
    }
  } else {
    // 로그아웃 상태일 때
    authButton.style.display = "block";
    userProfile.style.display = "none";
    // 기존 로그인 모달 오픈 로직
    authButton.onclick = () => {
      loginModal.style.display = "block";
    };
    noGameDiv.style.display = "flex";
    gameDiv.style.display = "none";
    gameFrame.style.display = "none";
  }
});

closeButton.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// Toggle between login and signup modes
loginMethodChangeButton.addEventListener("click", () => {
  isLoginMode = !isLoginMode;

  // Update modal text based on the mode
  loginText.textContent = isLoginMode ? "로그인" : "회원가입";
  loginSubmitButton.textContent = isLoginMode ? "로그인" : "회원가입";
  loginMethodChangeButton.textContent = isLoginMode ? "회원가입" : "로그인";

  // Toggle visibility of optional fields (e.g., email)
  const optionalFields = document.querySelectorAll(".optional-field");
  optionalFields.forEach((field) => {
    field.style.display = isLoginMode ? "none" : "block";
  });
});
document.querySelectorAll(".optional-field").forEach((field) => {
  field.style.display = isLoginMode ? "none" : "block";
});

// Event listener for game data saving
window.addEventListener("message", async (event) => {
  if (event.data.type === "SAVE_GAME_DATA") {
    const user = auth.currentUser;
    if (user) {
      await saveGameData(user.uid, event.data.data);
    }
  }
});
