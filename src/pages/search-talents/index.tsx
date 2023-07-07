import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TablePagination,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { queryTalents } from "../../services/talents";
import { AxiosResponse } from "axios";
import { Search as SearchIcon } from "@mui/icons-material";
import PaginationActions from "./table-pagination-actions";
import { TalentSummary } from "./interfaces";
import CardSearchTalent from "./talent-card";

interface TalentsResult {
  talents: TalentSummary[];
  total: number;
}

const SearchTalents: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 547px)");
  const [input, setInput] = useState("");
  const [talentsFound, setTalentsFound] = useState<TalentsResult>({
    talents: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const handleChangePageNumber = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
    searchTalents(input, pageSize, newPage);
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPageNumber(0);
    searchTalents(input, newSize, 1);
  };

  const searchTalents = useCallback(
    (query: string, pageSize = 10, pageNumber = 1) => {
      setIsLoading(true);

      queryTalents(query, pageSize, pageNumber + 1)
        .then((response: AxiosResponse) => {
          const result = response.data;
          setTalentsFound(result.data);
        })
        .catch((error: any) => {
          const message = error.response.data.message;
          console.error("Erro: ", message);
        })
        .finally(() => setIsLoading(false));
    },
    []
  );

  const submitSearch = (event: any) => {
    event.preventDefault();
    searchTalents(input);
  };

  useEffect(() => {
    searchTalents("");
  }, [searchTalents]);

  return (
    <Box
      id="welcome-root"
      display="center"
      justifyContent="center"
      pb="100px"
      pt="50px"
    >
      <Stack
        id="welcome-fields"
        direction="column"
        maxWidth="900px"
        width="100%"
        justifyContent="center"
        gap="16px"
      >
        <form onSubmit={submitSearch}>
          <TextField
            fullWidth
            label="Digite sua pesquisa"
            value={input}
            onChange={(event: any) => {
              setInput(event.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => undefined}
                    onMouseDown={(
                      event: React.MouseEvent<HTMLButtonElement>
                    ) => {
                      event.preventDefault();
                    }}
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
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
                sx={{ border: 0, justifyContent: "flex-end", width: "100%" }}
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
                style={{ border: 0 }}
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
    </Box>
  );
};

export default SearchTalents;
