import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  TablePagination,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { queryTalents } from "../../services/talents";
import PaginationActions from "./table-pagination-actions";
import { TalentSummary } from "./interfaces";
import CardSearchTalent from "./card-search-talent";
import { Search } from "@mui/icons-material";
import { TalentSearchQuery } from "../../models/talents";
import Footer from "../../components/footer";
import { MAX_APP_WIDTH } from "../../constants";

interface TalentsResult {
  talents: TalentSummary[];
  total: number;
}

const SearchTalents: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 547px)");
  const [freeText, setFreeText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [languages, setLanguages] = useState("");
  const [frameworks, setFrameworks] = useState("");
  const [databases, setDatabases] = useState("");
  const [otherSkills, setOtherSkills] = useState("");
  const [talentsFound, setTalentsFound] = useState<TalentsResult>({
    talents: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleChangePageNumber = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
    searchTalents();
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPageNumber(0);
    searchTalents();
  };

  const searchTalents = useCallback(() => {
    setIsLoading(true);

    const clampedPageNumber = pageNumber > 1 ? pageNumber : 1;

    const query: TalentSearchQuery = {};

    if (freeText.length) query.freeText = freeText.toLowerCase();
    if (name.length) query.name = name.toLowerCase();
    if (email.length) query.email = email.toLowerCase();
    if (languages.length) query.languages = languages.toLowerCase();
    if (frameworks.length) query.frameworks = frameworks.toLowerCase();
    if (databases.length) query.databases = databases.toLowerCase();
    if (otherSkills.length) query.otherSkills = otherSkills.toLowerCase();

    queryTalents(query, pageSize, clampedPageNumber)
      .then((response: AxiosResponse) => {
        const result = response.data;
        setTalentsFound(result.data);
      })
      .catch((error: any) => {
        const message = error.response.data.message;
        console.error("Erro: ", message);
      })
      .finally(() => setIsLoading(false));
  }, [
    databases,
    email,
    frameworks,
    freeText,
    languages,
    name,
    otherSkills,
    pageNumber,
    pageSize,
  ]);

  useEffect(() => {
    searchTalents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      id="welcome-root"
      display="flex"
      justifyContent="center"
      alignItems="center"
      pt="50px"
    >
      <Box mb="32px">
        <h2>Busca de talentos</h2>
      </Box>
      <Stack
        id="welcome-fields"
        direction="column"
        maxWidth={MAX_APP_WIDTH}
        width="100%"
        justifyContent="center"
        gap="16px"
      >
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TextField
              fullWidth
              label="Texto livre"
              value={freeText}
              onChange={(event: any) => {
                setFreeText(event.target.value);
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome"
              value={name}
              onChange={(event: any) => {
                setName(event.target.value);
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="E-mail"
              value={email}
              onChange={(event: any) => {
                setEmail(event.target.value);
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Linguagens de programação"
              value={languages}
              onChange={(event: any) => {
                setLanguages(event.target.value);
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Frameworks"
              value={frameworks}
              onChange={(event: any) => {
                setFrameworks(event.target.value);
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Bancos de dados"
              value={databases}
              onChange={(event: any) => {
                setDatabases(event.target.value);
              }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Outras habilidades"
              value={otherSkills}
              onChange={(event: any) => {
                setOtherSkills(event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={searchTalents}>
            <Search />
            <Box marginLeft="4px">Pesquisar</Box>
          </Button>
        </Box>
        <h2>Resultados</h2>
        <Box>
          {isLoading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              marginTop="100px"
            >
              <CircularProgress />
            </Box>
          )}
          {!isLoading && !talentsFound.talents?.length && (
            <Box fontSize="0.8em">Nenhum resultado encontrado.</Box>
          )}
          {!isLoading && !!talentsFound.talents?.length && (
            <>
              <TablePagination
                sx={{
                  border: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
                rowsPerPageOptions={
                  !isMobile
                    ? [5, 10, 25, { label: "Mostrar tudo", value: -1 }]
                    : []
                }
                colSpan={3}
                count={talentsFound.total}
                rowsPerPage={pageSize}
                labelRowsPerPage="Resultados por página"
                labelDisplayedRows={({ from, to, count }) => {
                  return `${from}–${to} de ${
                    count !== -1 ? count : `mais que ${to}`
                  }`;
                }}
                page={pageNumber}
                SelectProps={{
                  inputProps: {
                    "aria-label": "talentos por página",
                  },
                  native: true,
                }}
                onPageChange={handleChangePageNumber}
                onRowsPerPageChange={handleChangePageSize}
                ActionsComponent={PaginationActions}
              />
              {talentsFound.talents.map((talent: TalentSummary) => (
                <Box key={talent._id}>
                  <CardSearchTalent talent={talent} />
                </Box>
              ))}
              <TablePagination
                sx={{
                  border: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
                rowsPerPageOptions={[]}
                colSpan={3}
                count={talentsFound.total}
                rowsPerPage={pageSize}
                labelRowsPerPage="Resultados por página"
                labelDisplayedRows={() => {
                  return "";
                }}
                page={pageNumber}
                SelectProps={{
                  inputProps: {
                    "aria-label": "talentos por página",
                  },
                  native: true,
                }}
                onPageChange={handleChangePageNumber}
                onRowsPerPageChange={handleChangePageSize}
                ActionsComponent={PaginationActions}
              />
            </>
          )}
        </Box>
      </Stack>
      <Box
        width="100%"
        maxWidth={MAX_APP_WIDTH}
        textAlign="left"
        fontSize="0.8em"
      >
        <Footer />
      </Box>
    </Stack>
  );
};

export default SearchTalents;
