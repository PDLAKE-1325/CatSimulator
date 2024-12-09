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

// DOM Elements
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

// 기존 모달 토글 및 로그인 모드 변경 코드 동일

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
onAuthStateChanged(auth, (user) => {
  // 전체 body에 로그인 상태 클래스 추가
  document.body.classList.toggle("logged-in", !!user);
  document.body.classList.toggle("logged-out", !user);

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
});
