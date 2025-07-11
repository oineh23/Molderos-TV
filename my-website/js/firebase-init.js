
// === Firebase Init ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBESUG0JfLbRTdO204reLwFaEJKzPCXNSI",
  authDomain: "molderos-tv.firebaseapp.com",
  projectId: "molderos-tv",
  storageBucket: "molderos-tv.firebasestorage.app",
  messagingSenderId: "465999851775",
  appId: "1:465999851775:web:e37c2cca9da97c80e49cca",
  measurementId: "G-FFB0HVLY5Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();

window.loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem("molderos_username", user.displayName);
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("user-greeting").textContent = "👋 Hi, " + user.displayName;
    loadWatchlistFromCloud(user.uid);
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

window.logout = async () => {
  await signOut(auth);
  localStorage.removeItem("molderos_username");
  localStorage.removeItem("firebase_uid");
  location.reload();
};

window.saveWatchlistToCloud = async (uid) => {
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  await setDoc(doc(db, "watchlists", uid), { items: watchlist });
};

window.loadWatchlistFromCloud = async (uid) => {
  localStorage.setItem("firebase_uid", uid);
  const docRef = doc(db, "watchlists", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    localStorage.setItem("watchlist", JSON.stringify(docSnap.data().items || []));
    displayWatchlist();
  }
};
