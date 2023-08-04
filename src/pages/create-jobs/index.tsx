import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { EmploymentType, LocationType } from "../../models/talents";
import { translateEmploymentType, translateLocationType } from "../../utils";
import { Job, SeniorityLevel } from "../../models/jobs";

const EMPTY_PROFESSION: Job = {
  creatorId: undefined,
  companyName: "",
  roleName: "",
  employmentType: EmploymentType.FULL_TIME,
  companyLocation: "",
  locationType: LocationType.REMOTE,
  description: "",
  mandatoryRequirements: "",
  preferredRequirements: "",
  mandatorySkills: [],
  preferredSkills: [],
  seniorityLevel: SeniorityLevel.INTERN,
};

const CreateJobs: React.FC = () => {
  const [jobToAdd, setJobToAdd] = useState<Job>(EMPTY_PROFESSION);

  const SectionTitle = ({ text }: { text: string }) => {
    return (
      <Box color="#00000070" fontWeight={600}>
        {text}
      </Box>
    );
  };

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      pb="100px"
      pt="50px"
    >
      <Stack
        direction="column"
        maxWidth="1140px"
        width="100%"
        justifyContent="center"
        gap="16px"
      >
        <Box textAlign="center" fontWeight={800}>
          <h2>Criar Vaga</h2>
        </Box>
        <Box fontSize="0.8rem" marginBottom="32px" textAlign="center">
          Criação de propostas de trabalho para quem faz parte do nosso banco de
          talentos
        </Box>
        <SectionTitle text="Dados da vaga:" />
        <Stack direction="row" gap="16px">
          <TextField
            fullWidth
            required
            label="Nome da Empresa"
            variant="outlined"
            value={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (!jobToAdd) return;

              const nameCompany = {
                ...jobToAdd,
                companyName: event.target.value,
              };
              setJobToAdd(nameCompany);
            }}
          />
          <TextField
            label="Cargo"
            variant="outlined"
            fullWidth
            required
            value={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (!jobToAdd) return;

              const nameRole = {
                ...jobToAdd,
                roleName: event.target.value,
              };
              setJobToAdd(nameRole);
            }}
          />
        </Stack>
        <Stack direction="row" gap="16px">
          <Select
            variant="outlined"
            fullWidth
            required
            value={jobToAdd.employmentType.toString()}
            onChange={(event: SelectChangeEvent) => {
              if (!jobToAdd) return;

              const educ = {
                ...jobToAdd,
                employmentType: Number(event.target.value),
              };
              setJobToAdd(educ);
            }}
          >
            {Object.keys(EmploymentType)
              .filter((key: any) => isNaN(key))
              .map((type: string) => {
                return (
                  <MenuItem value={EmploymentType[type as any]} key={type}>
                    {translateEmploymentType(
                      EmploymentType[type as any] as any
                    )}
                  </MenuItem>
                );
              })}
          </Select>
          <Select
            variant="outlined"
            fullWidth
            required
            value={jobToAdd.locationType.toString()}
            onChange={(event: SelectChangeEvent) => {
              if (!jobToAdd) return;

              const educ = {
                ...jobToAdd,
                locationType: Number(event.target.value),
              };
              setJobToAdd(educ);
            }}
          >
            {Object.keys(LocationType)
              .filter((key: any) => isNaN(key))
              .map((type: string) => {
                return (
                  <MenuItem value={LocationType[type as any]} key={type}>
                    {translateLocationType(LocationType[type as any] as any)}
                  </MenuItem>
                );
              })}
          </Select>
        </Stack>
        <TextField
          label="Localização"
          variant="outlined"
          fullWidth
          required
          value={jobToAdd.companyLocation}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (!jobToAdd) return;

            const local = {
              ...jobToAdd,
              companyLocation: event.target.value,
            };
            setJobToAdd(local);
          }}
        />
        <TextField
          label="Descrição da vaga"
          variant="outlined"
          fullWidth
          multiline
          required
          maxRows={6}
          minRows={3}
          value={jobToAdd.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (!jobToAdd) return;

            const description = {
              ...jobToAdd,
              description: event.target.value,
            };
            setJobToAdd(description);
          }}
        />
      </Stack>
    </Stack>
  );
};

export default CreateJobs;
