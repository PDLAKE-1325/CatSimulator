import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
const authButton = document.getElementById("auth-button");
const loginModal = document.getElementById("login-modal");
const closeButton = document.querySelector(".close-button");
const googleLoginButton = document.getElementById("google-login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginSubmitButton = document.getElementById("login-submit");
const loginMethodChangeButton = document.getElementById("login-method-change");
const loginText = document.getElementById("login-text");

let isLoginMode = true;

// Modal Toggle
authButton.addEventListener("click", () => {
  loginModal.style.display = "block";
});

closeButton.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// Login/Signup Mode Toggle
loginMethodChangeButton.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  loginText.textContent = isLoginMode ? "로그인" : "회원가입";
  loginSubmitButton.textContent = isLoginMode ? "로그인" : "회원가입";
});

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
        console.log("회원가입 성공:", userCredential.user);
        loginModal.style.display = "none";
      })
      .catch((error) => {
        console.error("회원가입 실패:", error.message);
        alert("회원가입 실패: " + error.message);
      });
  }
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    authButton.textContent = "로그아웃";
    authButton.onclick = () => {
      signOut(auth)
        .then(() => {
          console.log("로그아웃 성공");
        })
        .catch((error) => {
          console.error("로그아웃 실패:", error);
        });
    };
  } else {
    // User is signed out
    authButton.textContent = "로그인";
    authButton.onclick = () => {
      loginModal.style.display = "block";
    };
  }
});
