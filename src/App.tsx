import React, { useEffect, useState } from "react";
import { Button, Snackbar, SnackbarOrigin, Stack } from "@mui/material";
import NavbarTop from "./components/navbar-top";
import { initializeFirebaseApp } from "./config/firebase";
import AppRoutes from "./routes";
import { getStorage, setStorage } from "./utils/storage";
import { COOKIES_CONSENT_STORAGE_KEY } from "./constants";

const App: React.FC = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    initializeFirebaseApp();
    const consent = getStorage(COOKIES_CONSENT_STORAGE_KEY);
    if (!consent) {
      setShowSnackbar(true);
    }
  }, []);

  const handleAccept = () => {
    setStorage(COOKIES_CONSENT_STORAGE_KEY, true.toString());
    setShowSnackbar(false);
  };

  const handleDecline = () => {
    setStorage(COOKIES_CONSENT_STORAGE_KEY, false.toString());
    setShowSnackbar(false);
  };

  const snackbarOrigin: SnackbarOrigin = {
    vertical: "bottom",
    horizontal: "center",
  };

  return (
    <Stack direction="column" className="page-container">
      <NavbarTop />
      <AppRoutes />

      <Snackbar
        open={showSnackbar}
        message="Nós usamos cookies e outras tecnologias semelhantes para melhorar a sua experiência em nossos serviços. Ao utilizar nossos serviços, você concorda com nossas condições. Para saber mais acesse nossa Política de Privacidade e Uso de Cookies"
        anchorOrigin={snackbarOrigin}
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={handleAccept}>
              Aceitar
            </Button>
            <Button variant="contained" onClick={handleDecline}>
              Recusar
            </Button>
          </Stack>
        }
      ></Snackbar>
    </Stack>
  );
};

export default App;
