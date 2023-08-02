import React, { useEffect, useState } from "react";
import { COOKIES_CONSENT_STORAGE_KEY } from "../../constants";
import { getStorage, setStorage } from "../../utils/storage";
import { Button, Snackbar, SnackbarOrigin, Stack } from "@mui/material";
import { ROUTING_PATH } from "../../routes/routes";

const CookiesAcceptMessage: React.FC = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const consent = getStorage(COOKIES_CONSENT_STORAGE_KEY);
    if (!consent) {
      setShowSnackbar(true);
    }
  }, []);

  const handleAccept = () => {
    setStorage(COOKIES_CONSENT_STORAGE_KEY, "true");
    setShowSnackbar(false);
  };

  const handleRefused = () => {
    setStorage(COOKIES_CONSENT_STORAGE_KEY, "false");
    setShowSnackbar(false);
  };

  const snackbarOrigin: SnackbarOrigin = {
    vertical: "bottom",
    horizontal: "center",
  };

  return (
    <Snackbar
      open={showSnackbar}
      message={
        <>
          Nós usamos cookies e outras tecnologias semelhantes para melhorar a
          sua experiência em nossos serviços. Ao utilizar nossos serviços, você
          concorda com nossas condições. Para saber mais acesse nossa{" "}
          <a href={ROUTING_PATH.PRIVACY_POLICY}>
            Política de Privacidade e Uso de Cookies
          </a>
        </>
      }
      anchorOrigin={snackbarOrigin}
      action={
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleAccept}>
            Aceitar
          </Button>
          <Button variant="contained" onClick={handleRefused}>
            Recusar
          </Button>
        </Stack>
      }
    />
  );
};

export default CookiesAcceptMessage;
