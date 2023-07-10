import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import NavbarTop from "./components/navbar-top";
import { initializeFirebaseApp } from "./config/firebase";
import AppRoutes from "./routes";

const App: React.FC = () => {
  useEffect(() => {
    initializeFirebaseApp();
  }, []);

  return (
    <Stack direction="column" className="page-container">
      <NavbarTop />
      <AppRoutes />
    </Stack>
  );
};

export default App;
