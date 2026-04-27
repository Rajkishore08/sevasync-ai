import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOTKkn4w005wcA943dYp9ByS0Dk4bSacg",
  authDomain: "sevasync-ai-powered-help.firebaseapp.com",
  projectId: "sevasync-ai-powered-help",
  storageBucket: "sevasync-ai-powered-help.firebasestorage.app",
  messagingSenderId: "9998782603",
  appId: "1:9998782603:web:9f4beeed08f1e2d4ed848e",
  measurementId: "G-XNN5SS1QH1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firestore (Database)
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
