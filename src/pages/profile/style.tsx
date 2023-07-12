import { styled } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export const DataGroup = styled(Grid2)<any>(({ direction }: any) => ({
  display: "flex",
  flexDirection: direction,
  padding: "32px",
  alignItems: direction === "row" ? "center" : undefined,
  border: "1px solid #f5f5f5",
  borderRadius: "18px",
}));
