import React from "react";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { IMAGES } from "../../assets/imgs";

const NavbarTop: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 770px)");

  const Menu = () => {
    return (
      <Stack
        direction="row"
        gap="32px"
        fontWeight="600"
        fontSize="0.85rem"
        color="#000000"
      >
        <Stack direction="row">
          <a href="https://devbox.eng.br/#about" style={{ color: "#000" }}>
            QUEM SOMOS
          </a>
        </Stack>
        <Stack direction="row">
          <a href="https://devbox.eng.br/#features" style={{ color: "#000" }}>
            O QUE FAZEMOS
          </a>
        </Stack>
        <Stack direction="row">
          <a href="https://devbox.eng.br/#contact" style={{ color: "#000" }}>
            CONTATO
          </a>
        </Stack>
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
          <img src={IMAGES.LogoBlack500} width="200px" />
        </a>
      </Box>
      {!isMobile && <Menu />}
    </Stack>
  );
};

export default NavbarTop;
