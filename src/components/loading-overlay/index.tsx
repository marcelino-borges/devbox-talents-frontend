import { CircularProgress } from "@mui/material";
import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#00000030",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default LoadingOverlay;
