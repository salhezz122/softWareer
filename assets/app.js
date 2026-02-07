/* Amman FactCheck – Firebase FINAL WORKING VERSION */

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

/* init firebase */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* app config */
const APP = {
  company: "Amman FactCheck",
  adminPassword: "SS4625ss"
};

/* toast */
function toast(msg){
  const t = document.getElementById("toast");
  if(!t){ alert(msg); return; }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 2500);
}

/* ================= AUTH ================= */

async function registerUser({ companyName, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await addDoc(collection(db, "users"), {
    uid: cred.user.uid,
    companyName,
    email,
    status: "pending",
    createdAt: serverTimestamp()
  });
}

async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  const q = query(collection(db, "users"), where("uid", "==", cred.user.uid));
  const snap = await getDocs(q);

  if (snap.empty) throw new Error("الحساب غير موجود");
  const user = snap.docs[0].data();

  if (user.status !== "approved") {
    throw new Error("الحساب قيد المراجعة من الأدمن");
  }

  location.href = "dashboard.html";
}

function loginAdmin({ password }) {
  if (password !== APP.adminPassword) {
    throw new Error("كلمة مرور الأدمن غير صحيحة");
  }
  localStorage.setItem("admin", "1");
  location.href = "admin.html";
}

function logout(){
  signOut(auth);
  localStorage.removeItem("admin");
  location.href = "index.html";
}

/* ================= INIT INDEX ================= */

function initIndex() {

  /* اسم الشركة */
  document.querySelectorAll("[data-company]").forEach(
    el => el.textContent = APP.company
  );

  /* ====== تبديل الواجهات (المشكلة الأساسية) ====== */
  const modeBtns = document.querySelectorAll("[data-mode]");
  const panels = document.querySelectorAll("[data-panel]");

  function show(mode){
    panels.forEach(p=>{
      p.style.display =
        p.getAttribute("data-panel") === mode ? "block" : "none";
    });
    modeBtns.forEach(b=>{
      b.classList.toggle("active", b.getAttribute("data-mode") === mode);
    });
  }

  modeBtns.forEach(btn=>{
    btn.onclick = ()=> show(btn.getAttribute("data-mode"));
  });

  show("login"); // الافتراضي

  /* ===== Register ===== */
  registerForm?.addEventListener("submit", async e=>{
    e.preventDefault();
    try{
      await registerUser({
        companyName: regCompany.value,
        email: regEmail.value,
        password: regPassword.value
      });
      toast("تم إرسال طلب إنشاء الحساب، بانتظار موافقة الأدمن");
      registerForm.reset();
      show("login");
    }catch(err){
      toast(err.message);
    }
  });

  /* ===== Login ===== */
  loginForm?.addEventListener("submit", async e=>{
    e.preventDefault();
    try{
      await loginUser({
        email: loginEmail.value,
        password: loginPassword.value
      });
    }catch(err){
      toast(err.message);
    }
  });

  /* ===== Admin Login ===== */
  adminForm?.addEventListener("submit", e=>{
    e.preventDefault();
    try{
      loginAdmin({ password: adminPassword.value });
    }catch(err){
      toast(err.message);
    }
  });
}

/* ================= OTHER PAGES ================= */

function initUserDashboard(){
  logoutBtn?.addEventListener("click", logout);
}

function initAdmin(){
  if(!localStorage.getItem("admin")){
    location.href = "index.html";
    return;
  }
  logoutBtn?.addEventListener("click", logout);
}

function initArchive(){
  document.querySelectorAll("[data-company]").forEach(
    el => el.textContent = APP.company
  );
}

/* expose */
window.AFC = {
  initIndex,
  initUserDashboard,
  initAdmin,
  initArchive
};
