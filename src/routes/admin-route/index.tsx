import React, { useEffect } from "react";
import { FIREBASE_USER_STORAGE_KEY, TALENT_STORAGE_KEY } from "../../constants";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../../utils/storage";
import { Talent } from "../../types";
import { User } from "firebase/auth";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
}: PrivateRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fireabaseUserString = getStorage(FIREBASE_USER_STORAGE_KEY);
    const talentString = getStorage(TALENT_STORAGE_KEY);

    if (fireabaseUserString && talentString) {
      const fireabaseUser = JSON.parse(fireabaseUserString) as User;
      const talent = JSON.parse(talentString) as Talent;

      if (!talent.isAdmin) {
        navigate(`/profile/${fireabaseUser.uid}`);
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default PrivateRoute;
