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

const ADMIN_PASSWORD = "SS4625ss";

/* Helpers */
function toast(msg) {
  alert(msg);
}

/* Register */
async function registerUser(company, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await addDoc(collection(db, "users"), {
    uid: cred.user.uid,
    company,
    email,
    status: "pending",
    createdAt: serverTimestamp()
  });

  toast("تم إنشاء الحساب، بانتظار موافقة الأدمن");
}

/* Login */
async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  const q = query(collection(db, "users"), where("uid", "==", cred.user.uid));
  const snap = await getDocs(q);

  if (snap.empty) throw new Error("المستخدم غير موجود");

  const user = snap.docs[0].data();
  if (user.status !== "approved") {
    throw new Error("الحساب قيد المراجعة");
  }

  location.href = "dashboard.html";
}

/* Admin */
function loginAdmin(pass) {
  if (pass !== ADMIN_PASSWORD) throw new Error("كلمة مرور الأدمن خاطئة");
  localStorage.setItem("admin", "true");
  location.href = "admin.html";
}

/* Init */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerForm")?.addEventListener("submit", e => {
    e.preventDefault();
    registerUser(
      regCompany.value,
      regEmail.value,
      regPassword.value
    ).catch(err => toast(err.message));
  });

  document.getElementById("loginForm")?.addEventListener("submit", e => {
    e.preventDefault();
    loginUser(
      loginEmail.value,
      loginPassword.value
    ).catch(err => toast(err.message));
  });

  document.getElementById("adminForm")?.addEventListener("submit", e => {
    e.preventDefault();
    try {
      loginAdmin(adminPassword.value);
    } catch (err) {
      toast(err.message);
    }
  });
});
