import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import NavbarTop from "./components/navbar-top";
import { initializeFirebaseApp } from "./config/firebase";
import AppRoutes from "./routes";
import { getStorage, setStorage } from "./utils/storage";
import { COOKIES_CONSENT_STORAGE_KEY } from "./constants";

const App: React.FC = () => {
  useEffect(() => {
    initializeFirebaseApp();
    const consent = getStorage(COOKIES_CONSENT_STORAGE_KEY);
    if (!consent) {
    }
  }, []);

  return (
    <Stack direction="column" className="page-container">
      <NavbarTop />
      <AppRoutes />
    </Stack>
  );
};

export default App;
