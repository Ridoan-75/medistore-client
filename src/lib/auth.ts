import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "./firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Backend এ user sync করার helper
const syncUserWithBackend = async (user: User) => {
  const token = await user.getIdToken();
  await fetch(`${API_URL}/api/auth/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Email/Password Login
export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Email/Password Register
export const registerWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await syncUserWithBackend(result.user); // DB তে save
  return result.user;
};

// Google Login
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await syncUserWithBackend(result.user); // DB তে save
  return result.user;
};

// Facebook Login
export const loginWithFacebook = async () => {
  const result = await signInWithPopup(auth, facebookProvider);
  await syncUserWithBackend(result.user); // DB তে save
  return result.user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};

// Current user token পাওয়ার helper — API call এ use করো
export const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// Auth state listener
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};