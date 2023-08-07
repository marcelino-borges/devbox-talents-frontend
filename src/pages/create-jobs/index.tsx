import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { EmploymentType, LocationType, Skill } from "../../models/talents";
import {
  translateEmploymentType,
  translateLocationType,
  translateSeniorityLevel,
} from "../../utils";
import { Job, SeniorityLevel } from "../../models/jobs";
import {
  DATABASES,
  FRAMEWORKS,
  LANGUAGES,
  MAX_APP_WIDTH,
  OTHER_SKILLS,
} from "../../constants";
import Footer from "../../components/footer";

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
  const [languageToAdd, setLanguageToAdd] = useState<Skill>();
  const [addedLanguages, setAddedLanguages] = useState<Skill[]>([]);
  const [frameworkToAdd, setFrameworkToAdd] = useState<Skill>();
  const [addedFrameworks, setAddedFrameworks] = useState<Skill[]>([]);
  const [addedDatabases, setAddedDatabases] = useState<Skill[]>([]);
  const [databaseToAdd, setDatabaseToAdd] = useState<Skill>();
  const [addedOtherSkills, setAddedOtherSkills] = useState<Skill[]>([]);
  const [otherSkillsToAdd, setOtherSkillsToAdd] = useState<Skill>();

  const SelectedSkills = ({ skills, setSkills }: any) => {
    if (!skills.length) return null;

    return (
      <Box
        style={{
          border: "1px dashed #e4e4e4",
          borderRadius: "10px",
        }}
      >
        <Stack direction="row" gap="16px" p="8px" flexWrap="wrap">
          {skills.map((skill: Skill) => (
            <Stack
              key={skill.label}
              direction="row"
              gap="4px"
              style={{
                borderRadius: "5px",
                backgroundColor: "#00000008",
                padding: "4px",
                fontSize: "0.7rem",
              }}
              alignItems="center"
            >
              {skill.label}
              <ClearIcon
                style={{
                  color: "#00000040",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const updatedList = skills.filter(
                    (addedSkill: Skill) => skill.value !== addedSkill.value
                  );
                  setSkills(updatedList);
                }}
              />
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  };

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
        <Select
          variant="outlined"
          fullWidth
          required
          value={jobToAdd.seniorityLevel.toString()}
          onChange={(event: SelectChangeEvent) => {
            if (!jobToAdd) return;

            const levelSenior = {
              ...jobToAdd,
              seniorityLevel: Number(event.target.value),
            };
            setJobToAdd(levelSenior);
          }}
        >
          {Object.keys(SeniorityLevel)
            .filter((key: any) => isNaN(key))
            .map((type: string) => {
              return (
                <MenuItem value={SeniorityLevel[type as any]} key={type}>
                  {translateSeniorityLevel(SeniorityLevel[type as any] as any)}
                </MenuItem>
              );
            })}
        </Select>
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
        <TextField
          label="Requisitos Obrigatorios"
          variant="outlined"
          fullWidth
          multiline
          required
          minRows={4}
          value={jobToAdd.mandatoryRequirements}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (!jobToAdd) return;

            const requirements = {
              ...jobToAdd,
              mandatoryRequirements: event.target.value,
            };
            setJobToAdd(requirements);
          }}
        />
        <TextField
          label="Requisitos Preferidos"
          variant="outlined"
          fullWidth
          multiline
          minRows={4}
          value={jobToAdd.preferredRequirements}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (!jobToAdd) return;

            const requirementsPreferred = {
              ...jobToAdd,
              preferredRequirements: event.target.value,
            };
            setJobToAdd(requirementsPreferred);
          }}
        />
        <br />
        <SectionTitle text="Habilidades Obrigatória" />
        <br />
        <Stack direction="row" gap="16px">
          <Box flexGrow={1}>
            <Autocomplete
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderInput={(params) => (
                <TextField {...params} label="Linguagens" />
              )}
              options={LANGUAGES}
              value={languageToAdd}
              onChange={(_: unknown, value: Skill | null) =>
                setLanguageToAdd(value ?? undefined)
              }
            />
          </Box>
          <Box flexGrow={0}>
            <Button
              variant="contained"
              style={{ height: "100%" }}
              onClick={() => {
                if (
                  languageToAdd &&
                  !addedLanguages.some(
                    (skill: Skill) => skill.value === languageToAdd.value
                  )
                ) {
                  setAddedLanguages([...(addedLanguages ?? []), languageToAdd]);
                }
              }}
            >
              Add
            </Button>
          </Box>
        </Stack>
        <SelectedSkills skills={addedLanguages} setSkills={setAddedLanguages} />
        <Stack direction="column" gap="16px">
          <Stack direction="row" gap="16px">
            <Box flexGrow={1}>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField {...params} label="Frameworks" />
                )}
                options={FRAMEWORKS}
                value={frameworkToAdd}
                onChange={(_: unknown, value: Skill | null) =>
                  setFrameworkToAdd(value ?? undefined)
                }
              />
            </Box>
            <Box flexGrow={0}>
              <Button
                variant="contained"
                style={{ height: "100%" }}
                onClick={() => {
                  if (
                    frameworkToAdd &&
                    !addedFrameworks.some(
                      (skill: Skill) => skill.value === frameworkToAdd.value
                    )
                  ) {
                    setAddedFrameworks([
                      ...(addedFrameworks ?? []),
                      frameworkToAdd,
                    ]);
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Stack>
          <SelectedSkills
            skills={addedFrameworks}
            setSkills={setAddedFrameworks}
          />
        </Stack>
        <Stack direction="column" gap="16px">
          <Stack direction="row" gap="16px">
            <Box flexGrow={1}>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField {...params} label="Bancos de dados" />
                )}
                options={DATABASES}
                value={frameworkToAdd}
                onChange={(_: unknown, value: Skill | null) =>
                  setDatabaseToAdd(value ?? undefined)
                }
              />
            </Box>
            <Box flexGrow={0}>
              <Button
                variant="contained"
                style={{ height: "100%" }}
                onClick={() => {
                  if (
                    databaseToAdd &&
                    !addedDatabases.some(
                      (skill: Skill) => skill.value === databaseToAdd.value
                    )
                  ) {
                    setAddedDatabases([
                      ...(addedDatabases ?? []),
                      databaseToAdd,
                    ]);
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Stack>
          <SelectedSkills
            skills={addedDatabases}
            setSkills={setAddedDatabases}
          />
        </Stack>
        <Stack direction="column" gap="16px">
          <Stack direction="row" gap="16px">
            <Box flexGrow={1}>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField {...params} label="Outras habilidades" />
                )}
                options={OTHER_SKILLS}
                value={otherSkillsToAdd}
                onChange={(_: unknown, value: Skill | null) =>
                  setOtherSkillsToAdd(value ?? undefined)
                }
              />
            </Box>
            <Box flexGrow={0}>
              <Button
                variant="contained"
                style={{ height: "100%" }}
                onClick={() => {
                  if (
                    otherSkillsToAdd &&
                    !addedOtherSkills.some(
                      (skill: Skill) => skill.value === otherSkillsToAdd.value
                    )
                  ) {
                    setAddedOtherSkills([
                      ...(addedOtherSkills ?? []),
                      otherSkillsToAdd,
                    ]);
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Stack>
          <SelectedSkills
            skills={addedOtherSkills}
            setSkills={setAddedOtherSkills}
          />
        </Stack>
        <br />
        <SectionTitle text="Conhecimentos Diferenciais" />
        <br />
        <Stack direction="row" gap="16px">
          <Box flexGrow={1}>
            <Autocomplete
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderInput={(params) => (
                <TextField {...params} label="Linguagens" />
              )}
              options={LANGUAGES}
              value={languageToAdd}
              onChange={(_: unknown, value: Skill | null) =>
                setLanguageToAdd(value ?? undefined)
              }
            />
          </Box>
          <Box flexGrow={0}>
            <Button
              variant="contained"
              style={{ height: "100%" }}
              onClick={() => {
                if (
                  languageToAdd &&
                  !addedLanguages.some(
                    (skill: Skill) => skill.value === languageToAdd.value
                  )
                ) {
                  setAddedLanguages([...(addedLanguages ?? []), languageToAdd]);
                }
              }}
            >
              Add
            </Button>
          </Box>
          <SelectedSkills
            skills={addedLanguages}
            setSkills={setAddedLanguages}
          />
        </Stack>
        <Stack direction="column" gap="16px">
          <Stack direction="row" gap="16px">
            <Box flexGrow={1}>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField {...params} label="Frameworks" />
                )}
                options={FRAMEWORKS}
                value={frameworkToAdd}
                onChange={(_: unknown, value: Skill | null) =>
                  setFrameworkToAdd(value ?? undefined)
                }
              />
            </Box>
            <Box flexGrow={0}>
              <Button
                variant="contained"
                style={{ height: "100%" }}
                onClick={() => {
                  if (
                    frameworkToAdd &&
                    !addedFrameworks.some(
                      (skill: Skill) => skill.value === frameworkToAdd.value
                    )
                  ) {
                    setAddedFrameworks([
                      ...(addedFrameworks ?? []),
                      frameworkToAdd,
                    ]);
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Stack>
          <SelectedSkills
            skills={addedFrameworks}
            setSkills={setAddedFrameworks}
          />
        </Stack>
        <Stack direction="column" gap="16px">
          <Stack direction="row" gap="16px">
            <Box flexGrow={1}>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField {...params} label="Bancos de dados" />
                )}
                options={DATABASES}
                value={frameworkToAdd}
                onChange={(_: unknown, value: Skill | null) =>
                  setDatabaseToAdd(value ?? undefined)
                }
              />
            </Box>
            <Box flexGrow={0}>
              <Button
                variant="contained"
                style={{ height: "100%" }}
                onClick={() => {
                  if (
                    databaseToAdd &&
                    !addedDatabases.some(
                      (skill: Skill) => skill.value === databaseToAdd.value
                    )
                  ) {
                    setAddedDatabases([
                      ...(addedDatabases ?? []),
                      databaseToAdd,
                    ]);
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Stack>
          <SelectedSkills
            skills={addedDatabases}
            setSkills={setAddedDatabases}
          />
        </Stack>
        <Stack direction="column" gap="16px" mb="30px">
          <Stack direction="row" gap="16px">
            <Box flexGrow={1}>
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderInput={(params) => (
                  <TextField {...params} label="Outras habilidades" />
                )}
                options={OTHER_SKILLS}
                value={otherSkillsToAdd}
                onChange={(_: unknown, value: Skill | null) =>
                  setOtherSkillsToAdd(value ?? undefined)
                }
              />
            </Box>
            <Box flexGrow={0}>
              <Button
                variant="contained"
                style={{ height: "100%" }}
                onClick={() => {
                  if (
                    otherSkillsToAdd &&
                    !addedOtherSkills.some(
                      (skill: Skill) => skill.value === otherSkillsToAdd.value
                    )
                  ) {
                    setAddedOtherSkills([
                      ...(addedOtherSkills ?? []),
                      otherSkillsToAdd,
                    ]);
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Stack>
          <SelectedSkills
            skills={addedOtherSkills}
            setSkills={setAddedOtherSkills}
          />
        </Stack>
        <Button fullWidth variant="contained">
          Criar Vaga
        </Button>
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

export default CreateJobs;
