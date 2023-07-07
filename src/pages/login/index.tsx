import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { signIn } from "../../services/auth";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { translateFirebaseError } from "../../utils/firebase";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = (event: any) => {
    event.preventDefault();

    if (isLoading) return;

    setError("");
    setIsLoading(true);
    signIn(
      email,
      password,
      (user: User) => {
        setIsLoading(false);
        navigate(`/profile/${user.uid}`);
      },
      (error: any) => {
        setIsLoading(false);
        const translatedError = translateFirebaseError(error.message);
        if (translatedError) setError(translatedError);
        else setError("Erro ao entrar.");
        console.error("Erro ao entrar: ", translatedError);
      }
    );
  };

  return (
    <Box id="login-root" display="center" justifyContent="center">
      <Stack
        id="login-fields"
        direction="column"
        maxWidth="400px"
        width="100%"
        justifyContent="center"
        gap="16px"
        mt="50px"
      >
        <Box textAlign="center" fontWeight={800}>
          <h2>Entrar</h2>
        </Box>
        {error.length ? (
          <Box color="red" fontSize="0.8em" mb="32px" textAlign="center">
            {error}
          </Box>
        ) : (
          <Box
            color="transparent"
            fontSize="0.8em"
            mb="32px"
            textAlign="center"
          >
            |
          </Box>
        )}
        <form
          onSubmit={login}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            label="Senha"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setPassword(event.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((current) => !current)}
                    onMouseDown={(
                      event: React.MouseEvent<HTMLButtonElement>
                    ) => {
                      event.preventDefault();
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box mt="16px">
            <Button fullWidth variant="contained" type="submit">
              {isLoading ? (
                <CircularProgress size="24px" style={{ color: "white" }} />
              ) : (
                "Entrar"
              )}
            </Button>
          </Box>
        </form>
        <Box textAlign="center" mt="16px">
          Não tem conta? <a href="/account">Crie aqui</a>
        </Box>
      </Stack>
    </Box>
  );
};

export default Login;
