import React from "react";
import { Education } from "../../models/talents";
import { Box, IconButton, Stack } from "@mui/material";
import { format } from "date-fns";
import { Delete } from "@mui/icons-material";

interface EducationCardProps {
  education: Education;
  deleteEducation?: (education: Education) => void;
}

const EducationCard: React.FC<EducationCardProps> = ({
  education,
  deleteEducation,
}: EducationCardProps) => {
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
          <strong>Instituição:</strong> {education.institution}
        </Box>
        <Box>
          <strong>Curso:</strong> {education.course}
        </Box>
        <Box>
          <strong>Início:</strong>{" "}
          {format(
            education.start ? new Date(education.start) : new Date(),
            "dd/MM/yyyy"
          )}
        </Box>
        {education?.end && (
          <Box>
            <strong>Término:</strong>{" "}
            {format(
              education.end ? new Date(education.end) : new Date(),
              "dd/MM/yyyy"
            )}
          </Box>
        )}
      </Stack>
      {deleteEducation && (
        <Box>
          <IconButton
            onClick={() => {
              if (deleteEducation) deleteEducation(education);
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
};

export default EducationCard;
