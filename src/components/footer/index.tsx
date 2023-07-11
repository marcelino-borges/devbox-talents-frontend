import { Box, Stack, useMediaQuery } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";

const Footer: React.FC = () => {
  const isSmall = useMediaQuery("(max-width: 1140px)");

  const ExternalLink = ({ href, children }: any) => {
    return (
      <a
        href={href}
        style={{
          color: "#000",
          fontWeight: 400,
        }}
      >
        {children}
      </a>
    );
  };

  return (
    <Stack
      direction="column"
      fontSize="1.2em"
      mt="100px"
      px={isSmall ? "16px" : 0}
    >
      <Grid2 container py="32px">
        <Grid2 xs={12} md={9}>
          <Box fontWeight={700} fontSize="1.3em" mb="25px">
            Devbox LTDA
          </Box>
          <Box mb="32px">CNPJ 50.391.566/0001-60</Box>
        </Grid2>
        <Grid2 xs={12} md={3}>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Quem somos
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              O que fazemos
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Como trabalhamos
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Alguns números
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Como funciona
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Depoimentos
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Portfolio
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Nosso foco
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Contato
            </ExternalLink>
          </Grid2>
          <Grid2 xs={12}>
            <ExternalLink href="https://devbox.eng.br/#about">
              Contato
            </ExternalLink>
          </Grid2>
        </Grid2>
      </Grid2>
      <Box py="50px" borderTop="0.5px solid #00000020" fontSize="0.9em">
        © 2023 <span style={{ fontWeight: 500 }}>Devbox LTDA</span>. Todos os
        direitos reservados.
      </Box>
    </Stack>
  );
};

export default Footer;
