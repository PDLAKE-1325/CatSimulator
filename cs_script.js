import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFO4eVxwUJ-28HoD7Q13AaLxYBYHD4sBk",
  authDomain: "catsimul.firebaseapp.com",
  projectId: "catsimul",
  storageBucket: "catsimul.firebasestorage.app",
  messagingSenderId: "82898723961",
  appId: "1:82898723961:web:ce2a076172c472e1f020a8",
  measurementId: "G-TEDF2GCJ45",
  databaseURL: "https://catsimul-default-rtdb.firebaseio.com/",
};

const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const loginWithGoogleButton = document.getElementById("google-login");
const loginMethodChangeButton = document.getElementById("login-method-change");

links.forEach((link) => {
  link.addEventListener("click", function (e) {
    const targetHref = this.getAttribute("href");

    // 'story.html'로 이동할 경우, 부드러운 스크롤을 적용하지 않고 바로 이동
    if (targetHref === "#login") {
      window.location.href = "loginForm.html"; // story.html로 이동
    } else if (targetHref === "#chat") {
      window.location.href = "chat.html";
      // } else {
      //   // 다른 링크에 대해 부드러운 스크롤 적용
      //   e.preventDefault();
      //   const targetSection = document.querySelector(targetHref);

      //   if (targetSection) {
      //     const index = Array.from(sections).indexOf(targetSection);
      //     scrollToSection(index); // 부드러운 스크롤 실행
      //   }
    }
  });
});

// // DOM 요소 선택
// const loginForm = document.getElementById("login-form");
// const signupForm = document.getElementById("signup-form");
// const userProfile = document.getElementById("user-profile");

// const loginEmail = document.getElementById("email-input");
// const loginPassword = document.getElementById("password-input");
// const loginButton = document.getElementById("login-button");

// const signupEmail = document.getElementById("signup-email");
// const signupPassword = document.getElementById("signup-password");
// const confirmPassword = document.getElementById("confirm-password");
// const signupButton = document.getElementById("signup-button");

// const signupLink = document.getElementById("signup-link");
// const loginLink = document.getElementById("login-link");

// const userEmailDisplay = document.getElementById("user-email");
// const logoutButton = document.getElementById("logout-button");

// // 이메일 유효성 검사 함수
// function validateEmail(email) {
//   const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return re.test(String(email).toLowerCase());
// }

// // 비밀번호 유효성 검사 함수
// function validatePassword(password) {
//   // 최소 8자, 대소문자, 숫자, 특수문자 포함
//   const re =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   return re.test(password);
// }

// // 로그인 처리
// loginButton.addEventListener("click", () => {
//   const email = loginEmail.value.trim();
//   const password = loginPassword.value;

//   if (!validateEmail(email)) {
//     alert("유효하지 않은 이메일 형식입니다.");
//     return;
//   }

//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       showUserProfile(user);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       let errorMessage = "로그인 중 오류가 발생했습니다.";

//       switch (errorCode) {
//         case "auth/invalid-email":
//           errorMessage = "유효하지 않은 이메일 주소입니다.";
//           break;
//         case "auth/user-disabled":
//           errorMessage = "해당 사용자 계정이 비활성화되었습니다.";
//           break;
//         case "auth/user-not-found":
//           errorMessage = "존재하지 않는 사용자입니다.";
//           break;
//         case "auth/wrong-password":
//           errorMessage = "잘못된 비밀번호입니다.";
//           break;
//       }

//       alert(errorMessage);
//     });
// });

// // 회원가입 처리
// signupButton.addEventListener("click", () => {
//   const email = signupEmail.value.trim();
//   const password = signupPassword.value;
//   const confirmPass = confirmPassword.value;

//   if (!validateEmail(email)) {
//     alert("유효하지 않은 이메일 형식입니다.");
//     return;
//   }

//   if (!validatePassword(password)) {
//     alert("비밀번호는 최소 8자, 대소문자, 숫자, 특수문자를 포함해야 합니다.");
//     return;
//   }

//   if (password !== confirmPass) {
//     alert("비밀번호가 일치하지 않습니다.");
//     return;
//   }

//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       alert("계정이 성공적으로 생성되었습니다.");
//       showUserProfile(user);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       let errorMessage = "회원가입 중 오류가 발생했습니다.";

//       switch (errorCode) {
//         case "auth/email-already-in-use":
//           errorMessage = "이미 사용 중인 이메일 주소입니다.";
//           break;
//         case "auth/invalid-email":
//           errorMessage = "유효하지 않은 이메일 주소입니다.";
//           break;
//         case "auth/operation-not-allowed":
//           errorMessage = "이메일/비밀번호 계정이 비활성화되었습니다.";
//           break;
//         case "auth/weak-password":
//           errorMessage = "비밀번호가 너무 약합니다.";
//           break;
//       }

//       alert(errorMessage);
//     });
// });

// // 로그아웃 처리
// logoutButton.addEventListener("click", () => {
//   signOut(auth)
//     .then(() => {
//       showLoginForm();
//     })
//     .catch((error) => {
//       console.error("로그아웃 중 오류:", error);
//     });
// });

// // 회원가입 링크 클릭 시 폼 전환
// signupLink.addEventListener("click", (e) => {
//   e.preventDefault();
//   loginForm.style.display = "none";
//   signupForm.style.display = "block";
// });

// // 로그인 링크 클릭 시 폼 전환
// loginLink.addEventListener("click", (e) => {
//   e.preventDefault();
//   signupForm.style.display = "none";
//   loginForm.style.display = "block";
// });

// // 사용자의 로그인 상태를 감지하고 상태를 유지
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     showUserProfile(user);
//   } else {
//     showLoginForm();
//   }
// });

// // 사용자 프로필 표시
// function showUserProfile(user) {
//   loginForm.style.display = "none";
//   signupForm.style.display = "none";
//   userProfile.style.display = "block";
//   userEmailDisplay.textContent = user.email;
// }

// // 로그인 폼 표시
// function showLoginForm() {
//   userProfile.style.display = "none";
//   signupForm.style.display = "none";
//   loginForm.style.display = "block";
// }
