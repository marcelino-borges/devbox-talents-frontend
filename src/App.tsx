import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import NavbarTop from "./components/navbar-top";
import { initializeFirebaseApp } from "./config/firebase";
import AppRoutes from "./routes";

import CookiesAcceptMessage from "./components/cookies-accept-message";

const App: React.FC = () => {
  useEffect(() => {
    initializeFirebaseApp();
  }, []);

  return (
    <Stack direction="column" className="page-container">
      <NavbarTop />
      <AppRoutes />
      <CookiesAcceptMessage />
    </Stack>
  );
};

export default App;
