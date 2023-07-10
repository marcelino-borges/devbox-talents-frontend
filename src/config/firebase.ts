import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { clearStorage, setStorage } from "../utils/storage";
import { TOKEN_STORAGE_KEY, FIREBASE_USER_STORAGE_KEY } from "../constants";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const initializeFirebaseApp = () => {
  initializeApp(firebaseConfig);
  const auth = getAuth();

  auth.onIdTokenChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      setStorage(TOKEN_STORAGE_KEY, token);
      setStorage(FIREBASE_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      clearStorage(TOKEN_STORAGE_KEY);
    }
  });
};

export { initializeFirebaseApp };
