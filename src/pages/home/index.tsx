import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { IMAGES } from "../../assets/imgs";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ROUTING_PATH } from "../../routes/routes";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import { FIREBASE_USER_STORAGE_KEY, MAX_APP_WIDTH } from "../../constants";
import { getStorage } from "../../utils/storage";
import { User } from "firebase/auth";

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 770px)");
  const isSmallerThanMD = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStorage(FIREBASE_USER_STORAGE_KEY);

    if (storedUser) {
      const user = JSON.parse(storedUser) as User;

      if (user) {
        navigate(`${ROUTING_PATH.PROFILE}/${user.uid}`);
      }
    }
  }, [navigate]);

  return (
    <Stack
      direction="column"
      alignItems="center"
      fontSize="0.8em"
      textAlign="center"
      position="absolute"
      top={isMobile ? "83.5px" : "123.5px"}
      style={{
        transition: "top 0.25s ease",
      }}
      left={0}
      right={0}
    >
      <Box
        style={{
          backgroundImage: `url(${IMAGES.Banner1})`,
          backgroundSize: "cover",
          minHeight: "60vh",
          backgroundPositionX: "right",
          width: "100%",
        }}
      />
      <Stack
        direction="column"
        minHeight="135px"
        p="64px"
        width="100%"
        maxWidth={MAX_APP_WIDTH}
      >
        <Box mb="32px" fontSize="2em" fontWeight={800}>
          Bem-vindo ao nosso portal de talentos!
        </Box>
        <Box>
          <Box>
            Estamos contratando constantemente para os projetos dos nossos
            clientes que rodam aqui.
          </Box>
          <Box>
            Para isso, sempre que surgir demanda iremos olhar{" "}
            <strong>primeiro</strong> nossa base de talentos antes de buscarmos
            no mercado.
          </Box>
        </Box>
      </Stack>
      <Grid2
        container
        alignItems="center"
        bgcolor="#000"
        color="#fff"
        minHeight="260px"
        p="64px"
        spacing={4}
        width="100%"
      >
        <Grid2
          xs={12}
          md={4}
          fontSize="2em"
          fontWeight={800}
          maxWidth={MAX_APP_WIDTH}
        >
          Oportunidades
        </Grid2>
        <Grid2
          xs={12}
          md={8}
          textAlign={isSmallerThanMD ? "center" : "left"}
          maxWidth={MAX_APP_WIDTH}
        >
          Cadastre seu perfil conosco para receber oportunidades de trabalho
          para a área de tecnologia antes de todo mundo.
        </Grid2>
      </Grid2>
      <Stack direction="column" minHeight="135px" p="64px" width="100%">
        <Box mb="32px" fontSize="2em" fontWeight={800}>
          Junte-se a nós!
        </Box>
        <Box fontSize="1.5em">
          <Link to={ROUTING_PATH.LOGIN}>ENTRE</Link> ou{" "}
          <Link to={ROUTING_PATH.REGISTER}>CADASTRE-SE</Link>
        </Box>
      </Stack>
      <Box width="100%" maxWidth={MAX_APP_WIDTH} textAlign="left">
        <Footer />
      </Box>
    </Stack>
  );
};

export default Home;
