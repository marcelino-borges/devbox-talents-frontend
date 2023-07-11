import React, { useEffect } from "react";
import { FIREBASE_USER_STORAGE_KEY, TALENT_STORAGE_KEY } from "../../constants";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../../utils/storage";
import { ROUTING_PATH } from "../routes";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
}: PrivateRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fireabaseUser = getStorage(FIREBASE_USER_STORAGE_KEY);
    const talent = getStorage(TALENT_STORAGE_KEY);

    if (!fireabaseUser || !talent) {
      navigate(ROUTING_PATH.LOGIN);
    }
  }, [navigate]);

  return <>{children}</>;
};

export default PrivateRoute;
