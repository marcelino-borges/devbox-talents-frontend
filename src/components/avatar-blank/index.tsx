import React from "react";
import { Person } from "@mui/icons-material";
import { Avatar } from "@mui/material";

interface AvatarBlankProps {
  size: number;
}

const AvatarBlank: React.FC<AvatarBlankProps> = ({
  size = 150,
}: AvatarBlankProps) => {
  return (
    <Avatar
      sx={{
        bgcolor: "#f5f5f5",
        color: "#00000050",
        width: `${size}px`,
        height: `${size}px`,
        svg: {
          width: `${size * 0.6}px`,
          height: `${size * 0.6}px`,
        },
      }}
    >
      <Person />
    </Avatar>
  );
};

export default AvatarBlank;
