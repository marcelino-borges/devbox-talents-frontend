export const translateFirebaseError = (error: string) => {
  if (error.includes("auth/email-already-in-use")) return "E-mail já em uso.";
  if (
    error.includes("auth/id-token-expired") ||
    error.includes("auth/id-token-revoked") ||
    error.includes("auth/invalid-id-token")
  )
    return "Entre novamente.";
  if (error.includes("auth/invalid-email")) return "E-mail inválido.";
  if (
    error.includes("auth/invalid-password") ||
    error.includes("auth/user-not-found")
  )
    return "Credenciais inválidas ou usuário não existe.";

  return null;
};
