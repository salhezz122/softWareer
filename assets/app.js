/* Amman FactCheck – Firebase version (converted from LocalStorage) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyCtVmD12uHz-JFAcPv5EpwDVKdSvaslzAo",
  authDomain: "amman-factcheck.firebaseapp.com",
  projectId: "amman-factcheck",
  storageBucket: "amman-factcheck.firebasestorage.app",
  messagingSenderId: "515492556687",
  appId: "1:515492556687:web:7526dc7b3e0ecc74d2a5fa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===== App Config ===== */
const APP = {
  company: "Amman FactCheck",
  adminPassword: "SS4625ss"
};

/* ===== Helpers ===== */
function toast(msg){
  alert(msg);
}

/* ===== AUTH ===== */
async function registerUser({ companyName, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await addDoc(collection(db, "users"), {
    uid: cred.user.uid,
    companyName,
    email,
    role: "user",
    status: "pending",
    createdAt: serverTimestamp()
  });
}

async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  const q = query(
    collection(db, "users"),
    where("uid", "==", cred.user.uid)
  );
  const snap = await getDocs(q);

  if (snap.empty) throw new Error("الحساب غير موجود");
  const user = snap.docs[0].data();

  if (user.status !== "approved") {
    throw new Error("الحساب قيد المراجعة من الأدمن");
  }

  window.location.href = "dashboard.html";
}

function loginAdmin({ password }) {
  if (password !== APP.adminPassword) {
    throw new Error("كلمة مرور الأدمن غير صحيحة");
  }
  localStorage.setItem("admin", "true");
  window.location.href = "admin.html";
}

function logout() {
  signOut(auth);
  localStorage.removeItem("admin");
  window.location.href = "index.html";
}

/* ===== INIT PAGES ===== */
function initIndex() {
  document.querySelectorAll("[data-company]").forEach(
    el => el.textContent = APP.company
  );

  document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    try {
      await registerUser({
        companyName: regCompany.value,
        email: regEmail.value,
        password: regPassword.value
      });
      toast("تم إرسال طلب إنشاء الحساب");
    } catch (err) {
      toast(err.message);
    }
  });

  document.getElementById("loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    try {
      await loginUser({
        email: loginEmail.value,
        password: loginPassword.value
      });
    } catch (err) {
      toast(err.message);
    }
  });

  document.getElementById("adminForm")?.addEventListener("submit", e => {
    e.preventDefault();
    try {
      loginAdmin({ password: adminPassword.value });
    } catch (err) {
      toast(err.message);
    }
  });
}

function initAdmin() {
  if (!localStorage.getItem("admin")) {
    location.href = "index.html";
    return;
  }
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
}

function initUserDashboard() {
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
}

/* expose */
window.AFC = {
  initIndex,
  initAdmin,
  initUserDashboard
};
