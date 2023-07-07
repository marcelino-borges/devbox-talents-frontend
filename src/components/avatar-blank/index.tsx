import React from "react";
import { UserAvatar } from "./style";
import { Person } from "@mui/icons-material";

const AvatarBlank: React.FC = () => {
  return (
    <UserAvatar>
      <Person />
    </UserAvatar>
  );
};

export default AvatarBlank;
