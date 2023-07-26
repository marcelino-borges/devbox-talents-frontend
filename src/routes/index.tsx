import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import Account from "../pages/create-account";
import Profile from "../pages/profile";
import SearchTalents from "../pages/search-talents";
import PrivateRoute from "./private-route";
import AdminRoute from "./admin-route";
import { ROUTING_PATH } from "./routes";
import Home from "../pages/home";
import TermsOfUse from "../pages/terms-of-use";

const AppRoutes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: ROUTING_PATH.HOME,
      element: <Home />,
    },
    {
      path: ROUTING_PATH.LOGIN,
      element: <Login />,
    },
    {
      path: ROUTING_PATH.REGISTER,
      element: <Account />,
    },
    {
      path: `${ROUTING_PATH.EDIT_ACCOUNT}/:authId`,
      element: (
        <PrivateRoute>
          <Account />
        </PrivateRoute>
      ),
    },
    {
      path: `${ROUTING_PATH.PROFILE}/:authId`,
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: ROUTING_PATH.SEARCH,
      element: (
        <AdminRoute>
          <SearchTalents />
        </AdminRoute>
      ),
    },
    {
      path: ROUTING_PATH.TERMS,
      element: <TermsOfUse />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
