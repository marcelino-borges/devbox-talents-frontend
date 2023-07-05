import { Box, Button, CircularProgress, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTalent } from "../../services/talents";
import { AxiosResponse } from "axios";
import { ApiResult, Education, Job, Talent } from "../../types";
import { joinSkills } from "../../utils";
import JobCard from "../../components/job-card";
import EducationCard from "../../components/education-card";
import { Edit } from "@mui/icons-material";
import { PRIMARY_COLOR } from "../../constants/colors";

interface DataRowProps {
  name: string;
  value: any;
}

const Profile: React.FC = () => {
  const { authId } = useParams();
  const [profile, setProfile] = useState<Talent>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (authId) {
      getTalent({ authId })
        .then((response: AxiosResponse) => {
          const result: ApiResult = response.data;
          const talent = result.data;

          if (talent) {
            setProfile(talent);
          } else {
            setError("Perfil não localizado.");
          }
        })
        .catch((error: any) => {
          const message = error.response.data.message;
          setError(message);
        });
    }
  }, [authId]);

  const DataRow = ({ name, value }: DataRowProps) => {
    return (
      <Box fontSize="0.8em">
        <strong>{name}: </strong>
        {value}
      </Box>
    );
  };

  return profile ? (
    <Stack direction="column" alignItems="center" pt="50px" pb="100px">
      <Stack direction="column" gap="8px">
        <Stack
          direction="row"
          mb="32px"
          fontSize="1.8em"
          fontWeight={800}
          alignItems="center"
          justifyContent="center"
          gap="16px"
        >
          Seu perfil
          <Edit style={{ color: PRIMARY_COLOR, cursor: "pointer" }} />
        </Stack>
        <DataRow name="Nome" value={profile?.firstName || ""} />
        <DataRow name="Sobrenome" value={profile?.lastName || ""} />
        <DataRow name="E-mail" value={profile?.email || ""} />
        <DataRow
          name="Linguagens"
          value={
            profile?.languages
              ? joinSkills(profile.languages)
              : "Nada informado"
          }
        />
        <DataRow
          name="Frameworks"
          value={
            profile?.frameworks
              ? joinSkills(profile.frameworks)
              : "Nada informado"
          }
        />
        <DataRow
          name="Bancos de dados"
          value={
            profile?.databases
              ? joinSkills(profile.databases)
              : "Nada informado"
          }
        />
        <DataRow
          name="Outras habilidades"
          value={
            profile?.otherSkills
              ? joinSkills(profile.otherSkills)
              : "Nada informado"
          }
        />
        <DataRow
          name="Histórico profissional"
          value={
            profile?.jobHistory ? (
              <Stack direction="column" gap="8px" pt="8px">
                {profile?.jobHistory.map((job: Job) => (
                  <JobCard job={job} />
                ))}
              </Stack>
            ) : (
              "Nada informado"
            )
          }
        />
        <DataRow
          name="Educação"
          value={
            profile?.educationHistory ? (
              <Stack direction="column" gap="8px" pt="8px">
                {profile?.educationHistory.map((education: Education) => (
                  <EducationCard education={education} />
                ))}
              </Stack>
            ) : (
              "Nada informado"
            )
          }
        />
        <DataRow name="LinkedIn" value={profile?.social.linkedin || ""} />
        {profile?.social.personalWebsite && (
          <DataRow
            name="Site Pessoal"
            value={profile?.social.personalWebsite || ""}
          />
        )}
        {profile?.social.instagram && (
          <DataRow name="Instagram" value={profile?.social.instagram || ""} />
        )}
        {profile?.social.git && (
          <DataRow name="Git" value={profile?.social.git || ""} />
        )}
      </Stack>
    </Stack>
  ) : (
    <Box
      display="flex"
      width="100%"
      height="70vh"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};

export default Profile;
