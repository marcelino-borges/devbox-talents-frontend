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
    height: isMobileExpanded ? "auto" : 0,
    visibility: isMobileExpanded ? "visible" : "hidden",
    transition: !isMobile
      ? undefined
      : !isMobileExpanded
      ? "height 0.5s ease, top 0.5s ease, visibility 0.5s easeout"
      : "all 0.5s ease",
    justifyContent: "center",
    paddingBottom: "16px",
    zIndex: 100000,
    backgroundColor: "#fff",
    width: "100%",
    position: "absolute",
    top: isMobileExpanded ? (isMobile ? "83.5px" : "123.5px") : "0px",
    left: 0,
    right: 0,
  })
);
