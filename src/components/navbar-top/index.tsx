import React, { useCallback, useEffect, useState } from "react";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { IMAGES } from "../../assets/imgs";
import { getStorage } from "../../utils/storage";
import { TOKEN_STORAGE_KEY } from "../../constants";
import { logout } from "../../services/auth";
import MenuSvg from "../../assets/icons/menu.svg";
import { MenuContainer, MenuLink } from "./style";

const NavbarTop: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 770px)");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    const token = getStorage(TOKEN_STORAGE_KEY);

    setIsLoggedIn(!!token?.length);
  }, []);

  const Menu = () => {
    return (
      <Stack
        direction={isMobile ? "column" : "row"}
        gap="32px"
        fontWeight="600"
        fontSize="0.85rem"
        color="#000000"
      >
        <MenuLink
          href="https://devbox.eng.br/#about"
          textAlign={isMobile ? "center" : undefined}
        >
          QUEM SOMOS
        </MenuLink>
        <MenuLink
          href="https://devbox.eng.br/#features"
          textAlign={isMobile ? "center" : undefined}
        >
          O QUE FAZEMOS
        </MenuLink>
        <MenuLink
          href="https://devbox.eng.br/#contact"
          textAlign={isMobile ? "center" : undefined}
        >
          CONTATO
        </MenuLink>
        {isLoggedIn && (
          <a
            href="/"
            style={{ color: "#000" }}
            onClick={() => {
              logout();
            }}
          >
            SAIR
          </a>
        )}
      </Stack>
    );
  };

  useEffect(() => {
    if (!isMobile) setIsMobileExpanded(false);
  }, [isMobile]);

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      style={{
        overflowY: "hidden",
        borderBottom:
          isMobile && isMobileExpanded ? "1px solid #00000040" : undefined,
        paddingBottom: isMobile ? "16px" : undefined,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        my={isMobile ? "20px" : "40px"}
        style={{
          transition: "all 0.5s ease",
        }}
      >
        <Box>
          <a href="https://devbox.eng.br">
            <img src={IMAGES.LogoBlack500} width="125px" />
          </a>
        </Box>
        {!isMobile ? (
          <Menu />
        ) : (
          <Box
            p="4px"
            borderRadius="5px"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setIsMobileExpanded((current) => !current);
            }}
          >
            <img src={MenuSvg} width="27px" />
          </Box>
        )}
      </Stack>
      <MenuContainer isMobile={isMobile} isMobileExpanded={isMobileExpanded}>
        {Menu()}
      </MenuContainer>
    </Stack>
  );
};

export default NavbarTop;
