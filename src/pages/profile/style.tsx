import { Box, styled } from "@mui/material";

const SIZE = 150;

export const DataGroup = styled(Box)<any>(({ direction }: any) => ({
  display: "flex",
  flexDirection: direction,
  padding: "32px",
  alignItems: direction === "row" ? "center" : undefined,
  border: "1px solid #f5f5f5",
  borderRadius: "18px",
}));

export const UserAvatar = styled(Box)({
  backgroundColor: "#f5f5f5",
  width: `${SIZE}px`,
  height: `${SIZE}px`,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  svg: {
    fontSize: SIZE * 0.9,
    color: "#e0e0e0",
  },
});
