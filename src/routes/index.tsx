import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import Account from "../pages/create-account";
import Profile from "../pages/profile";
import SearchTalents from "../pages/search-talents";
import PrivateRoute from "./private-route";
import AdminRoute from "./admin-route";

const AppRoutes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Account />,
    },
    {
      path: "/edit-account/:authId",
      element: (
        <PrivateRoute>
          <Account />
        </PrivateRoute>
      ),
    },
    {
      path: "/profile/:authId",
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: "/search",
      element: (
        <AdminRoute>
          <SearchTalents />
        </AdminRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
