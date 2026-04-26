import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    console.log("Starting Google login process..."); // Console check
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Login success!", result.user.email);
    return result.user;
  } catch (error: any) {
    console.error("Login failed detailed error:", error.code, error.message);
    if (error.code === 'auth/popup-blocked') {
        alert("Popup blocked! Please allow popups for localhost:3000 in your browser settings.");
    } else if (error.code === 'auth/configuration-not-found') {
        alert("Google Login is not enabled in Firebase Console. Please enable it in Auth > Sign-in method.");
    }
    throw error;
  }
};