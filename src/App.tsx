import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import NavbarTop from "./components/navbar-top";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import Account from "./pages/create-account";
import { initializeFirebaseApp } from "./config/firebase";
import Profile from "./pages/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/account/:authId",
    element: <Account />,
  },
  {
    path: "/profile/:authId",
    element: <Profile />,
  },
]);

const App: React.FC = () => {
  useEffect(() => {
    initializeFirebaseApp();
  }, []);

  return (
    <Stack direction="column" className="page-container">
      <NavbarTop />
      <RouterProvider router={router} />
    </Stack>
  );
};

export default App;
