import React, { useEffect, useState } from "react";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { translateFirebaseError } from "../../utils/firebase";
import { getStorage, setStorage } from "../../utils/storage";
import {
  FIREBASE_USER_STORAGE_KEY,
  MAX_APP_WIDTH,
  TALENT_STORAGE_KEY,
} from "../../constants";
import { Talent, GetTalentQuery } from "../../types";
import { getTalent } from "../../services/talents";
import { ROUTING_PATH } from "../../routes/routes";
import Footer from "../../components/footer";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const navigateToProfile = (authId: string) => {
    navigate(`${ROUTING_PATH.PROFILE}/${authId}`);
  };

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
        navigateToProfile(user.uid);

        const query: GetTalentQuery = {
          authId: user.uid,
        };

        getTalent(query, (talent: Talent) => {
          setStorage(TALENT_STORAGE_KEY, JSON.stringify(talent));
        });
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

  useEffect(() => {
    const storedUser = getStorage(FIREBASE_USER_STORAGE_KEY);

    if (storedUser) {
      const user = JSON.parse(storedUser) as User;

      if (user) {
        navigate(`${ROUTING_PATH.PROFILE}/${user.uid}`);
      }
    }
  }, [navigate]);

  return (
    <Stack
      id="login-root"
      display="flex"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
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
          Não tem conta? <a href="/register">Crie aqui</a>
        </Box>
      </Stack>
      <Box
        width="100%"
        maxWidth={MAX_APP_WIDTH}
        textAlign="left"
        fontSize="0.8em"
      >
        <Footer />
      </Box>
    </Stack>
  );
};

export default Login;
