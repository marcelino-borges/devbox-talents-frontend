import React, { useEffect, useState } from "react";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { IMAGES } from "../../assets/imgs";
import { getStorage } from "../../utils/storage";
import { TOKEN_STORAGE_KEY } from "../../constants";
import { logout } from "../../services/auth";

const NavbarTop: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 770px)");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getStorage(TOKEN_STORAGE_KEY);

    setIsLoggedIn(!!token?.length);
  }, []);

  const Menu = () => {
    return (
      <Stack
        direction="row"
        gap="32px"
        fontWeight="600"
        fontSize="0.85rem"
        color="#000000"
      >
        <a href="https://devbox.eng.br/#about" style={{ color: "#000" }}>
          QUEM SOMOS
        </a>
        <a href="https://devbox.eng.br/#features" style={{ color: "#000" }}>
          O QUE FAZEMOS
        </a>
        <a href="https://devbox.eng.br/#contact" style={{ color: "#000" }}>
          CONTATO
        </a>
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

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      my="40px"
    >
      <Box>
        <a href="https://devbox.eng.br">
          <img src={IMAGES.LogoBlack500} width="125px" />
        </a>
      </Box>
      {!isMobile && <Menu />}
    </Stack>
  );
};

export default NavbarTop;
