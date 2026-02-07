
/* Amman FactCheck - Firebase version (converted from LocalStorage) */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== Firebase Config (YOUR PROJECT) =====
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

// ===== App Config =====
const APP = {
  company: "Amman FactCheck",
  adminPassword: "SS4625ss"
};

// ===== Session =====
function setSession(data){
  sessionStorage.setItem("afc_session", JSON.stringify(data));
}
function getSession(){
  try { return JSON.parse(sessionStorage.getItem("afc_session")); }
  catch { return null; }
}
function clearSession(){
  sessionStorage.removeItem("afc_session");
}
function requireRole(role){
  const s = getSession();
  if(!s || s.role !== role) location.href = "index.html";
  return s;
}

// ===== Helpers =====
function toast(msg){
  const el = document.getElementById("toast");
  if(!el) return alert(msg);
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2200);
}

// ================= AUTH =================
async function registerUser({companyName, email, password}){
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await addDoc(collection(db,"users"),{
    uid: cred.user.uid,
    companyName,
    email,
    status: "pending",
    createdAt: new Date().toISOString()
  });
}

async function loginUser({email, password}){
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const q = query(collection(db,"users"), where("uid","==",cred.user.uid));
  const snap = await getDocs(q);
  if(snap.empty) throw new Error("الحساب غير موجود");
  const user = snap.docs[0];
  if(user.data().status !== "approved")
    throw new Error("الحساب قيد المراجعة");
  setSession({role:"user", uid:cred.user.uid, userDoc:user.id});
  return user.data();
}

function loginAdmin({password}){
  if(password !== APP.adminPassword)
    throw new Error("كلمة مرور الأدمن غير صحيحة");
  setSession({role:"admin"});
}

// ================= USERS (ADMIN) =================
async function listUsers(){
  const snap = await getDocs(collection(db,"users"));
  return snap.docs.map(d=>({id:d.id, ...d.data()}));
}

async function updateUser(id, patch){
  await updateDoc(doc(db,"users",id), patch);
}

// ================= NEWS =================
async function createNews({userUid, title, type, text, fileDataUrl, fileName}){
  await addDoc(collection(db,"news"),{
    userUid, title, type,
    text: text||"",
    fileDataUrl: fileDataUrl||"",
    fileName: fileName||"",
    status:"pending",
    verdict:null,
    createdAt:new Date().toISOString()
  });
}

async function listNews(){
  const snap = await getDocs(collection(db,"news"));
  return snap.docs.map(d=>({id:d.id, ...d.data()}));
}

// ================= INIT PAGES =================
function initIndex(){
  document.querySelectorAll("[data-company]").forEach(el=>el.textContent=APP.company);

  document.getElementById("adminForm")?.addEventListener("submit",e=>{
    e.preventDefault();
    try{
      loginAdmin({password:adminPassword.value});
      location.href="admin.html";
    }catch(err){ toast(err.message); }
  });

  document.getElementById("loginForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    try{
      await loginUser({email:loginEmail.value, password:loginPassword.value});
      location.href="dashboard.html";
    }catch(err){ toast(err.message); }
  });

  document.getElementById("registerForm")?.addEventListener("submit",async e=>{
    e.preventDefault();
    try{
      await registerUser({
        companyName:regCompany.value,
        email:regEmail.value,
        password:regPassword.value
      });
      toast("تم إرسال الطلب، بانتظار موافقة الأدمن");
    }catch(err){ toast(err.message); }
  });
}

// expose
window.AFC = {
  initIndex
};
