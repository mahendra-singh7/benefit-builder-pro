import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    console.log("Starting Google login process...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Login success!", result.user.email);
    return result.user;
  } catch (error: any) {
    console.error("Login failed detailed error:", error.code, error.message);
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError: any) {
        console.error("Redirect login failed", redirectError.code, redirectError.message);
        throw redirectError;
      }
    } else if (error.code === 'auth/configuration-not-found') {
      alert("Google Login is not enabled in Firebase Console. Please enable it in Auth > Sign-in method.");
    } else if (error.code === 'auth/unauthorized-domain') {
      alert("This domain is not authorized for Firebase Authentication. Add it in Authentication > Settings > Authorized domains.");
    }
    throw error;
  }
};