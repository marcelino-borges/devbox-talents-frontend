import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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
      console.log(
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
      console.log(`[${error.code}] Erro durante login: `, error.message);
      if (onError) onError(error);
    });
};

export const logout = async (): Promise<boolean> => {
  const auth = getAuth();
  return signOut(auth)
    .then(() => true)
    .catch((error) => {
      console.log("Erro durante logout: ", error.message);
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
