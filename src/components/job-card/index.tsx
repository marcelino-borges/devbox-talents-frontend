import React from "react";
import { Job } from "../../types";
import { Box, IconButton, Stack } from "@mui/material";
import {
  joinSkills,
  translateEmploymentType,
  translateLocationType,
} from "../../utils";
import { format } from "date-fns";
import { Delete } from "@mui/icons-material";

interface JobCardProps {
  job: Job;
  deleteJob?: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, deleteJob }: JobCardProps) => {
  return (
    <Stack
      direction="row"
      gap="4px"
      style={{
        borderRadius: "5px",
        backgroundColor: "#00000004",
        border: "2px dashed #00000009",
        fontSize: "0.7rem",
        width: "100%",
      }}
    >
      <Stack direction="column" gap="4px" p="8px" flexGrow={1}>
        <Box>
          <strong>Empresa:</strong> {job.companyName}
        </Box>
        <Box>
          <strong>Cargo:</strong> {job.roleName}
        </Box>
        <Box>
          <strong>Tipo de emprego:</strong>{" "}
          {translateEmploymentType(job.employmentType)}
        </Box>
        <Box>
          <strong>Localização:</strong> {job.location}
        </Box>
        <Box>
          <strong>Tipo da localização:</strong>{" "}
          {translateLocationType(job.locationType)}
        </Box>
        <Box>
          <strong>Ainda trabalho aqui:</strong>{" "}
          {job.currentEmployment ? "Sim" : "Não"}
        </Box>
        <Box>
          <strong>Início:</strong>{" "}
          {format(
            job.startDate ? new Date(job.startDate) : new Date(),
            "dd/MM/yyyy"
          )}
        </Box>
        {!job.currentEmployment && job.endDate && (
          <Box>
            <strong>Saída:</strong>{" "}
            {format(
              job.endDate ? new Date(job.endDate) : new Date(),
              "dd/MM/yyyy"
            )}
          </Box>
        )}
        {!!job.skills?.length && (
          <Box>
            <strong>Habilidades utilizadas: </strong>
            {joinSkills(job.skills)}
          </Box>
        )}
      </Stack>
      {deleteJob && (
        <Box>
          <IconButton
            onClick={() => {
              if (deleteJob) deleteJob(job);
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
};

export default JobCard;
