import { Box, styled } from "@mui/material";

export const DataGroup = styled(Box)<any>(({ direction }: any) => ({
  display: "flex",
  flexDirection: direction,
  padding: "32px",
  alignItems: direction === "row" ? "center" : undefined,
  border: "1px solid #f5f5f5",
  borderRadius: "18px",
}));
