import { styled } from "@mui/material";
import { PRIMARY_COLOR } from "../../constants/colors";

interface MenuLinkProps {
  href?: string;
  textAlign?: string;
}

export const MenuLink = styled("a")<MenuLinkProps>(({ textAlign }: any) => ({
  color: "#000",
  transition: "color 0.2s ease",
  "&:hover": {
    color: PRIMARY_COLOR,
  },
  textAlign,
}));

interface MenuContainerProps {
  isMobileExpanded?: boolean;
  isMobile?: boolean;
}

export const MenuContainer = styled("div")<MenuContainerProps>(
  ({ isMobile, isMobileExpanded }: any) => ({
    display: "flex",
    alignItems: isMobile ? "center" : "unset",
    height: isMobileExpanded ? "126px" : 0,
    visibility: isMobileExpanded ? "visible" : "hidden",
    transition: !isMobile
      ? undefined
      : !isMobileExpanded
      ? "height 0.5s ease"
      : "all 0.5s ease",
    justifyContent: "center",
  })
);
