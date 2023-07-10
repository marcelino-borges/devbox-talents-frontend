import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { clearStorage } from "../../utils/storage";
import {
  TOKEN_STORAGE_KEY,
  FIREBASE_USER_STORAGE_KEY,
  TALENT_STORAGE_KEY,
} from "../../constants";

export const createAccount = async (
  email: string,
  password: string,
  onSuccess?: (user: User) => void,
  onError?: (error: any) => void
) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (onSuccess) onSuccess(user);
    })
    .catch((error: any) => {
      console.error(
        `[${error.code}] Erro durante criação da conta: `,
        error.message
      );
      if (onError) onError(error);
    });
};

export const signIn = async (
  email: string,
  password: string,
  onSuccess?: (user: User) => void,
  onError?: (error: any) => void
) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (onSuccess) onSuccess(user);
    })
    .catch((error) => {
      console.error(`[${error.code}] Erro durante login: `, error.message);
      if (onError) onError(error);
    });
};

export const logout = async (): Promise<boolean> => {
  const auth = getAuth();
  return signOut(auth)
    .then(() => {
      clearStorage(FIREBASE_USER_STORAGE_KEY);
      clearStorage(TOKEN_STORAGE_KEY);
      clearStorage(TALENT_STORAGE_KEY);
      return true;
    })
    .catch((error) => {
      console.error("Erro durante logout: ", error.message);
      return false;
    });
};

export const deleteAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  return deleteUser(user)
    .then(() => true)
    .catch(() => false);
};
