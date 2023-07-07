import { Box, CircularProgress, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTalent } from "../../services/talents";
import { AxiosResponse } from "axios";
import { ApiResult, Education, Job, Talent } from "../../types";
import {
  joinSkills,
  translateEmploymentType,
  translateLocationType,
} from "../../utils";
import JobCard from "../../components/job-card";
import EducationCard from "../../components/education-card";
import {
  Edit,
  GitHub,
  Instagram,
  Link,
  LinkedIn,
  Person,
} from "@mui/icons-material";
import { PRIMARY_COLOR } from "../../constants/colors";
import { DataGroup, UserAvatar } from "./style";
import { format } from "date-fns";

interface DataRowProps {
  name: string;
  value: any;
}

const Profile: React.FC = () => {
  const { authId } = useParams();
  const [profile, setProfile] = useState<Talent>();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 992px)");

  useEffect(() => {
    if (authId) {
      getTalent({ authId })
        .then((response: AxiosResponse) => {
          const result: ApiResult = response.data;
          const talent = result.data;

          if (talent) {
            setProfile(talent);
          } else {
            console.error("Erro: Não conseguimos buscar o talento");
          }
        })
        .catch((error: any) => {
          const message = error.response.data.message;
          console.error("Erro: ", message);
        });
    }
  }, [authId]);

  const DataField = ({ name, value }: DataRowProps) => {
    return (
      <Box>
        {name}: <strong>{value}</strong>
      </Box>
    );
  };

  const SectionTitle = ({ title }: any) => (
    <strong style={{ color: "grey" }}>{title}</strong>
  );

  const Section = ({ title, children }: any) => {
    return (
      <Stack direction="column" gap="8px">
        <SectionTitle title={title} />
        <Stack
          direction={isDesktop ? "row" : "column"}
          gap={isDesktop ? "16px" : "4px"}
          flexWrap="wrap"
        >
          {children}
        </Stack>
      </Stack>
    );
  };

  return profile ? (
    <Stack
      direction="column"
      alignItems="center"
      pt="50px"
      pb="100px"
      fontSize="0.8em"
    >
      <Stack direction="column" gap="8px" width="100%">
        <Stack
          direction="row"
          mb="32px"
          fontSize="2em"
          fontWeight={800}
          alignItems="center"
          justifyContent="center"
          gap="16px"
        >
          Seu perfil
          <Edit
            style={{ color: PRIMARY_COLOR, cursor: "pointer" }}
            onClick={() => {
              navigate(`/account/${profile.authId}`);
            }}
          />
        </Stack>
        <DataGroup direction="row">
          <Box pr="32px" height="100%">
            <UserAvatar>
              <Person />
            </UserAvatar>
          </Box>
          <Stack
            direction="column"
            pl="32px"
            gap="32px"
            flexGrow={1}
            borderLeft="1px solid #f5f5f5"
          >
            <Section title="Dados pessoais">
              <DataField name="Nome" value={profile?.firstName || ""} />
              <DataField name="Sobrenome" value={profile?.lastName || ""} />
              <DataField name="E-mail" value={profile?.email || ""} />
            </Section>
            {profile.languages && (
              <Section title="Linguagens">
                <Box>{joinSkills(profile.languages)}</Box>
              </Section>
            )}
            {profile.frameworks && (
              <Section title="Frameworks">
                <Box>{joinSkills(profile.frameworks)}</Box>
              </Section>
            )}
            {profile.databases && (
              <Section title="Bancos de dados">
                <Box>{joinSkills(profile.databases)}</Box>
              </Section>
            )}
            {profile.otherSkills && (
              <Section title="Outras habilidades">
                <Box>{joinSkills(profile.otherSkills)}</Box>
              </Section>
            )}
          </Stack>
        </DataGroup>

        <DataGroup direction="column">
          <SectionTitle title="Histórico profissional" />
          <Box height="16px" />
          {profile?.jobHistory ? (
            <Stack direction="column" gap="8px" pt="8px">
              {profile?.jobHistory.map((job: Job) => (
                <Stack direction="column">
                  <Box fontSize="1.2em" color={PRIMARY_COLOR} fontWeight={800}>
                    📌 {job.companyName}
                  </Box>
                  <DataField name="Cargo" value={job.roleName} />
                  <DataField name="Localização" value={job.location} />
                  <DataField
                    name="Tipo de alocação"
                    value={translateLocationType(job.locationType)}
                  />
                  <DataField
                    name="Início"
                    value={format(new Date(job.startDate), "dd/MM/yyyy")}
                  />

                  <DataField
                    name="Desligamento"
                    value={
                      !job.currentEmployment && job.endDate
                        ? format(new Date(job.endDate), "dd/MM/yyyy")
                        : "-"
                    }
                  />

                  <DataField
                    name="Tipo de vínculo"
                    value={translateEmploymentType(job.employmentType)}
                  />
                  {!!job.skills?.length && (
                    <DataField
                      name="Habilidades utilizadas"
                      value={joinSkills(job.skills)}
                    />
                  )}
                  <DataField name="Descrição" value={job.description} />
                </Stack>
              ))}
            </Stack>
          ) : (
            "Nada informado"
          )}
        </DataGroup>

        <DataGroup direction="column">
          <SectionTitle title="Educação" />
          <Box height="16px" />
          {profile?.educationHistory ? (
            <Stack direction="column" gap="8px" pt="8px">
              {profile?.educationHistory.map((education: Education) => (
                <Stack direction="column">
                  <Box fontSize="1.2em" color={PRIMARY_COLOR} fontWeight={800}>
                    📌 {education.course}
                  </Box>
                  <DataField name="Instituição" value={education.institution} />
                  <DataField
                    name="Início"
                    value={format(new Date(education.start), "dd/MM/yyyy")}
                  />
                  <DataField
                    name="Conclusão"
                    value={
                      education.end
                        ? format(new Date(education.end), "dd/MM/yyyy")
                        : ""
                    }
                  />
                </Stack>
              ))}
            </Stack>
          ) : (
            "Nada informado"
          )}
        </DataGroup>

        <DataGroup direction="column">
          <SectionTitle title="Links" />
          <Box height="16px" />
          <Stack direction="row" alignItems="center" gap="8px">
            <LinkedIn style={{ color: "#b8b8b8" }} />
            <strong>{profile?.social.linkedin}</strong>
          </Stack>
          {profile?.social.personalWebsite && (
            <Stack direction="row" alignItems="center" gap="8px">
              <Link style={{ color: "#b8b8b8" }} />
              <strong>{profile?.social.personalWebsite}</strong>
            </Stack>
          )}
          {profile?.social.instagram && (
            <Stack direction="row" alignItems="center" gap="8px">
              <Instagram style={{ color: "#b8b8b8" }} />
              <strong>{profile?.social.instagram}</strong>
            </Stack>
          )}
          {profile?.social.git && (
            <Stack direction="row" alignItems="center" gap="8px">
              <GitHub style={{ color: "#b8b8b8" }} />
              <strong>{profile?.social.git}</strong>
            </Stack>
          )}
        </DataGroup>
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
