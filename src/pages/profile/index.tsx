import { Box, Stack } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

const Profile: React.FC = () => {
  const { authId } = useParams();

  return (
    <Stack direction="row">
      <Box></Box>
    </Stack>
  );
};

export default Profile;
