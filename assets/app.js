import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* Firebase */
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

const APP = {
  company: "Amman FactCheck",
  adminPassword: "SS4625ss"
};

function toast(msg){ alert(msg); }

/* ===== AUTH ===== */
async function registerUser(company, email, password){
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await addDoc(collection(db,"users"),{
    uid: cred.user.uid,
    company,
    status:"pending",
    createdAt: serverTimestamp()
  });
}

async function loginUser(email,password){
  const cred = await signInWithEmailAndPassword(auth,email,password);
  const q = query(collection(db,"users"), where("uid","==",cred.user.uid));
  const snap = await getDocs(q);
  if(snap.empty) throw "الحساب غير موجود";
  if(snap.docs[0].data().status!=="approved") throw "بانتظار موافقة الأدمن";
  location.href="dashboard.html";
}

function loginAdmin(pass){
  if(pass!==APP.adminPassword) throw "كلمة مرور خاطئة";
  localStorage.setItem("admin","1");
  location.href="admin.html";
}

function logout(){
  signOut(auth);
  localStorage.clear();
  location.href="index.html";
}

/* ===== INIT ===== */
function initIndex(){
  document.querySelectorAll("[data-company]").forEach(e=>e.textContent=APP.company);

  document.querySelectorAll("[data-mode]").forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll("[data-panel]").forEach(p=>p.style.display="none");
      document.querySelector(`[data-panel="${btn.dataset.mode}"]`).style.display="block";
    }
  });

  registerForm.onsubmit=e=>{
    e.preventDefault();
    registerUser(regCompany.value,regEmail.value,regPassword.value)
      .then(()=>toast("تم إنشاء الحساب"))
      .catch(e=>toast(e));
  };

  loginForm.onsubmit=e=>{
    e.preventDefault();
    loginUser(loginEmail.value,loginPassword.value).catch(e=>toast(e));
  };

  adminForm.onsubmit=e=>{
    e.preventDefault();
    try{ loginAdmin(adminPassword.value); }
    catch(err){ toast(err); }
  };
}

function initUserDashboard(){
  document.getElementById("logoutBtn")?.addEventListener("click",logout);
}

function initAdmin(){
  if(!localStorage.getItem("admin")) location.href="index.html";
  document.getElementById("logoutBtn")?.addEventListener("click",logout);
}

function initArchive(){
  document.querySelectorAll("[data-company]").forEach(e=>e.textContent=APP.company);
}

window.AFC={ initIndex, initUserDashboard, initAdmin, initArchive };
