import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormGroup,
  FormHelperText,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Clear as ClearIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  DATABASES,
  EMAIL_VALIDATOR,
  FRAMEWORKS,
  LANGUAGES,
  OTHER_SKILLS,
  PASSWORD_VALIDATOR,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "../../constants";
import {
  ApiResult,
  Education,
  EmploymentType,
  Job,
  LocationType,
  Skill,
  Talent,
} from "../../types";
import { PRIMARY_COLOR } from "../../constants/colors";
import { format } from "date-fns";
import { translateEmploymentType, translateLocationType } from "../../utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createTalent, getTalent, updateTalent } from "../../services/talents";
import { AxiosResponse } from "axios";
import { createAccount, deleteAccount } from "../../services/auth";
import { User } from "firebase/auth";
import { getStorage, setSessionStorage } from "../../utils/storage";
import { translateFirebaseError } from "../../utils/firebase";

const EMPTY_EDUCATION: Education = {
  institution: "",
  course: "",
  start: new Date(),
  end: new Date(),
};

const EMPTY_PROFESSION: Job = {
  companyName: "",
  roleName: "",
  employmentType: EmploymentType.FULL_TIME,
  location: "",
  locationType: LocationType.REMOTE,
  currentEmployment: false,
  startDate: new Date(),
  endDate: new Date(),
  description: "",
  skills: [],
};

const EMPTY_SOCIAL = {
  personalWebsite: "",
  linkedin: "",
  instagram: "",
  git: "",
};

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
}

const EMPTY_PERSONAL_DATA: PersonalData = {
  firstName: "",
  lastName: "",
  email: "",
};

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { authId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [addedLanguages, setAddedLanguages] = useState<Skill[]>([]);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");
  const [languageToAdd, setLanguageToAdd] = useState<Skill>();
  const [addedFrameworks, setAddedFrameworks] = useState<Skill[]>([]);
  const [frameworkToAdd, setFrameworkToAdd] = useState<Skill>();
  const [addedDatabases, setAddedDatabases] = useState<Skill[]>([]);
  const [databaseToAdd, setDatabaseToAdd] = useState<Skill>();
  const [showEducationDialog, setShowEducationDialog] = useState(false);
  const [addedEducations, setAddedEducations] = useState<Education[]>([]);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [addedJobs, setAddedJobs] = useState<Job[]>([]);
  const [addedOtherSkills, setAddedOtherSkills] = useState<Skill[]>([]);
  const [otherSkillsToAdd, setOtherSkillsToAdd] = useState<Skill>();
  const [social, setSocial] =
    useState<Partial<typeof EMPTY_SOCIAL>>(EMPTY_SOCIAL);
  const [socialErrors, setSocialErrors] =
    useState<Partial<typeof EMPTY_SOCIAL>>(EMPTY_SOCIAL);
  const [personalData, setPersonalData] =
    useState<PersonalData>(EMPTY_PERSONAL_DATA);
  const [personalDataErrors, setPersonalDataErrors] =
    useState<PersonalData>(EMPTY_PERSONAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const clearErrors = () => {
    setSocialErrors(EMPTY_SOCIAL);
    setPersonalDataErrors(EMPTY_PERSONAL_DATA);
  };

  const validateFormData = () => {
    clearErrors();

    if (!personalData.email.match(EMAIL_VALIDATOR)) {
      setPersonalDataErrors((current) => ({
        ...current,
        email: "E-mail inválido.",
      }));

      return false;
    }

    if (password.length > 32) {
      setPasswordError("Senha não pode ter mais de 32 caracteres.");

      return false;
    }

    if (!password.match(PASSWORD_VALIDATOR)) {
      setPasswordError("Senha não atende aos requisitos mínimos.");

      return false;
    }

    if (passwordConfirm !== password) {
      setPasswordConfirmError("Senhas precisam ser iguals.");

      return false;
    }

    return true;
  };

  const signUp = () => {
    if (!validateFormData()) return;

    setIsLoading(true);

    createAccount(
      personalData.email,
      password,
      (user: User) => {
        setIsLoading(false);
        setSessionStorage(USER_STORAGE_KEY, JSON.stringify(user));

        const newTalent: Talent = {
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          email: personalData.email,
          languages: addedLanguages,
          frameworks: addedFrameworks,
          databases: addedDatabases,
          otherSkills: addedOtherSkills,
          jobHistory: addedJobs,
          educationHistory: addedEducations,
          social: {
            personalWebsite: social.personalWebsite,
            linkedin: social.linkedin || "",
            instagram: social.instagram,
            git: social.git,
          },
        };

        createTalent(newTalent)
          .then(() => {
            navigate("/profile");
          })
          .catch((error: any) => {
            const translatedError = translateFirebaseError(error.message);
            console.log(translatedError);
            setSubmitError(translatedError);
            deleteAccount();
          });
      },
      (error: any) => {
        setIsLoading(false);
        const translatedError = translateFirebaseError(error.message);
        console.log(translatedError);
        setSubmitError(translatedError);
      }
    );
  };

  const updateTalentData = () => {
    if (!validateFormData()) return;

    setIsLoading(true);

    const talent: Talent = {
      firstName: personalData.firstName,
      lastName: personalData.lastName,
      email: personalData.email,
      languages: addedLanguages,
      frameworks: addedFrameworks,
      databases: addedDatabases,
      otherSkills: addedOtherSkills,
      jobHistory: addedJobs,
      educationHistory: addedEducations,
      social: {
        personalWebsite: social.personalWebsite,
        linkedin: social.linkedin || "",
        instagram: social.instagram,
        git: social.git,
      },
    };

    updateTalent(talent)
      .then(() => {
        setIsLoading(false);
        navigate("/profile");
      })
      .catch((error: any) => {
        setIsLoading(false);
        const translatedError = translateFirebaseError(error.message);
        console.log(translatedError);
        setSubmitError(translatedError);
      });
  };

  const getTalentData = (talentId: string) => {
    setIsLoading(true);
    getTalent({ id: talentId })
      .then((response: AxiosResponse) => {
        const result: ApiResult = response.data;
        const talent: Talent = result.data;

        if (talent) {
          setAddedLanguages(talent.languages ?? []);
          setAddedDatabases(talent.databases ?? []);
          setAddedFrameworks(talent.frameworks ?? []);
          setAddedEducations(talent.educationHistory ?? []);
          setAddedOtherSkills(talent.otherSkills ?? []);
          setSocial(talent.social);
          const personalData: PersonalData = {
            firstName: talent.firstName,
            lastName: talent.lastName,
            email: talent.email,
          };
          setPersonalData(personalData);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (authId) {
      if (!getStorage(TOKEN_STORAGE_KEY)?.length) {
        navigate("/");
        return;
      }
      setIsEditing(true);
      getTalentData(authId);
    }
  }, [authId]);

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

  const EducationFields = useCallback(
    ({ education }: { education: Education }) => {
      return (
        <Stack
          direction="column"
          gap="4px"
          p="8px"
          style={{
            borderRadius: "5px",
            backgroundColor: "#00000004",
            border: "2px dashed #00000009",
            fontSize: "0.7rem",
            width: "100%",
          }}
        >
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
      );
    },
    []
  );

  const JobFields = useCallback(({ job }: { job: Job }) => {
    return (
      <Stack
        direction="column"
        gap="4px"
        p="8px"
        style={{
          borderRadius: "5px",
          backgroundColor: "#00000004",
          border: "2px dashed #00000009",
          fontSize: "0.7rem",
          width: "100%",
        }}
      >
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
      </Stack>
    );
  }, []);

  const closeEducationDialog = () => {
    setShowEducationDialog(false);
  };

  const closeProfessionalDialog = () => {
    setShowJobDialog(false);
  };

  const SectionSpace = () => {
    return <Box height="16px" />;
  };

  const EducationDialog = () => {
    const [educationToAdd, setEducationToAdd] =
      useState<Education>(EMPTY_EDUCATION);
    const [hasEnded, setHasEnded] = useState(false);

    return (
      <Dialog
        open={showEducationDialog}
        onClose={closeEducationDialog}
        fullWidth
      >
        <DialogTitle>Adicionar Educação</DialogTitle>
        <DialogContent style={{ padding: "16px" }}>
          <Stack direction="column" gap="16px">
            <TextField
              label="Instituição"
              variant="outlined"
              fullWidth
              value={educationToAdd?.institution}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!educationToAdd) return;

                const educ = {
                  ...educationToAdd,
                  institution: event.target.value,
                };
                if (setEducationToAdd) setEducationToAdd(educ);
              }}
            />
            <TextField
              label="Curso"
              variant="outlined"
              fullWidth
              value={educationToAdd?.course}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!educationToAdd) return;

                const educ = {
                  ...educationToAdd,
                  course: event.target.value,
                };
                if (setEducationToAdd) setEducationToAdd(educ);
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasEnded}
                  onChange={(_: any, checked: boolean) => setHasEnded(checked)}
                />
              }
              label="Concluído"
            />
            <Stack direction="row" gap="16px" justifyContent="space-between">
              <DatePicker
                label="Data de início"
                value={educationToAdd?.start ?? new Date()}
                onChange={(newValue: any) => {
                  if (!educationToAdd) return;

                  const educ = {
                    ...educationToAdd,
                    start: new Date(format(newValue, "dd-MM-yyyy")),
                  };
                  if (setEducationToAdd) setEducationToAdd(educ);
                }}
              />
              <DatePicker
                disabled={!hasEnded}
                label="Data de término"
                value={educationToAdd?.end ?? new Date()}
                onChange={(newValue: any) => {
                  if (!educationToAdd) return;

                  const educ = {
                    ...educationToAdd,
                    end: new Date(format(newValue, "dd-MM-yyyy")),
                  };
                  if (setEducationToAdd) setEducationToAdd(educ);
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEducationDialog}>Cancelar</Button>
          <Button
            onClick={() => {
              if (
                educationToAdd &&
                educationToAdd.course?.length &&
                educationToAdd.institution?.length
              ) {
                const updated = {
                  ...educationToAdd,
                };

                if (!hasEnded) {
                  updated.end = undefined;
                }

                console.log("educationToAdd: ", updated);
                setAddedEducations([...addedEducations, updated]);
                closeEducationDialog();
              }
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const JobDialog = () => {
    const [jobToAdd, setJobToAdd] = useState<Job>(EMPTY_PROFESSION);
    const [addedJobSkills, setAddedJobSkills] = useState<Skill[]>([]);
    const [jobSkillToAdd, setJobSkillToAdd] = useState<Skill>();

    return (
      <Dialog open={showJobDialog} onClose={closeProfessionalDialog} fullWidth>
        <DialogTitle>Adicionar Experiência</DialogTitle>
        <DialogContent style={{ padding: "16px" }}>
          <Stack direction="column" gap="16px">
            <TextField
              label="Empresa"
              variant="outlined"
              fullWidth
              value={jobToAdd?.companyName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!jobToAdd) return;

                const educ = {
                  ...jobToAdd,
                  companyName: event.target.value,
                };
                setJobToAdd(educ);
              }}
            />
            <TextField
              label="Cargo"
              variant="outlined"
              fullWidth
              value={jobToAdd?.roleName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!jobToAdd) return;

                const educ = {
                  ...jobToAdd,
                  roleName: event.target.value,
                };
                setJobToAdd(educ);
              }}
            />
            <Select
              variant="outlined"
              fullWidth
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
            <TextField
              label="Localização"
              variant="outlined"
              fullWidth
              value={jobToAdd.location}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!jobToAdd) return;

                const educ = {
                  ...jobToAdd,
                  location: event.target.value,
                };
                setJobToAdd(educ);
              }}
            />
            <Select
              variant="outlined"
              fullWidth
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={jobToAdd.currentEmployment}
                  onChange={(_: any, checked: boolean) => {
                    const prof = {
                      ...jobToAdd,
                      currentEmployment: checked,
                    };
                    setJobToAdd(prof);
                  }}
                />
              }
              label="Ainda trabalho aqui"
            />
            <Stack direction="row" gap="16px" justifyContent="space-between">
              <DatePicker
                label="Início"
                value={jobToAdd?.startDate ?? new Date()}
                onChange={(newValue: any) => {
                  if (!jobToAdd) return;

                  const profession = {
                    ...jobToAdd,
                    startData: new Date(format(newValue, "dd-MM-yyyy")),
                  };
                  setJobToAdd(profession);
                }}
              />
              <DatePicker
                disabled={jobToAdd.currentEmployment}
                label="Saída"
                value={jobToAdd?.endDate ?? new Date()}
                onChange={(newValue: any) => {
                  if (!jobToAdd) return;

                  const profession = {
                    ...jobToAdd,
                    endDate: new Date(format(newValue, "dd-MM-yyyy")),
                  };
                  setJobToAdd(profession);
                }}
              />
            </Stack>
            <TextField
              label="Descrição das atividades"
              variant="outlined"
              fullWidth
              multiline
              maxRows={6}
              minRows={3}
              value={jobToAdd.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!jobToAdd) return;

                const educ = {
                  ...jobToAdd,
                  description: event.target.value,
                };
                setJobToAdd(educ);
              }}
            />
            <Stack direction="column" gap="16px">
              <Stack direction="row" gap="16px">
                <Box flexGrow={1}>
                  <Autocomplete
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField {...params} label="Habilidades usadas" />
                    )}
                    options={[
                      ...DATABASES,
                      ...LANGUAGES,
                      ...FRAMEWORKS,
                      ...OTHER_SKILLS,
                    ]}
                    value={jobSkillToAdd}
                    onChange={(_: unknown, value: Skill | null) =>
                      setJobSkillToAdd(value ?? undefined)
                    }
                  />
                </Box>
                <Box flexGrow={0}>
                  <Button
                    variant="contained"
                    style={{ height: "100%" }}
                    onClick={() => {
                      if (
                        jobSkillToAdd &&
                        !addedJobSkills.some(
                          (skill: Skill) => skill.value === jobSkillToAdd.value
                        )
                      ) {
                        setAddedJobSkills([
                          ...(addedJobSkills ?? []),
                          jobSkillToAdd,
                        ]);
                      }
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Stack>
              {SelectedSkills({
                skills: addedJobSkills,
                setSkills: setAddedJobSkills,
              })}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProfessionalDialog}>Cancelar</Button>
          <Button
            onClick={() => {
              if (
                jobToAdd &&
                jobToAdd.companyName?.length &&
                jobToAdd.location?.length &&
                jobToAdd.description?.length &&
                jobToAdd.roleName?.length
              ) {
                const updated = {
                  ...jobToAdd,
                };
                if (jobToAdd.currentEmployment) {
                  updated.endDate = undefined;
                }
                setAddedJobs([...addedJobs, updated]);
                closeProfessionalDialog();
              }
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
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
    <Box id="welcome-root" display="center" justifyContent="center" pb="100px">
      <Stack
        id="welcome-fields"
        direction="column"
        maxWidth="600px"
        width="100%"
        justifyContent="center"
        gap="16px"
        mt="50px"
      >
        <Box textAlign="center" fontWeight={800}>
          <h2>Criar conta</h2>
        </Box>
        {!!submitError.length && (
          <Box color="red" fontSize="0.8em" textAlign="center">
            {submitError}
          </Box>
        )}
        <SectionTitle text="Seus dados" />
        <Stack direction="row" gap="16px">
          <TextField
            fullWidth
            required
            disabled={isEditing}
            label="Nome"
            variant="outlined"
            value={personalData.firstName}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              const data = {
                ...personalData,
                firstName: event.target.value,
              };

              setPersonalData(data);
            }}
            error={!!personalDataErrors.firstName?.length}
            helperText={personalDataErrors.firstName}
          />
          <TextField
            disabled={isEditing}
            label="Sobrenome"
            variant="outlined"
            fullWidth
            required
            value={personalData.lastName}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              const data = {
                ...personalData,
                lastName: event.target.value,
              };

              setPersonalData(data);
            }}
            error={!!personalDataErrors.lastName?.length}
            helperText={personalDataErrors.lastName}
          />
        </Stack>
        <TextField
          disabled={isEditing}
          label="E-mail"
          variant="outlined"
          fullWidth
          required
          value={personalData.email}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            const data = {
              ...personalData,
              email: event.target.value,
            };

            setPersonalData(data);
          }}
          error={!!personalDataErrors.email?.length}
          helperText={personalDataErrors.email}
        />
        {!isEditing && (
          <>
            <FormGroup>
              <TextField
                label="Senha"
                variant="outlined"
                fullWidth
                required
                value={password}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((current) => !current)}
                        onMouseDown={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          event.preventDefault();
                        }}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => {
                  setPasswordError("");
                  setPassword(event.target.value);
                }}
                error={!!passwordError.length}
                helperText={passwordError}
              />
              <FormHelperText>
                <Box>Requisitos mínimos:</Box>
                <Box>- Pelo menos 6 caracteres</Box>
                <Box>- Pelo menos 1 letra</Box>
                <Box>- Pelo menos 1 número</Box>
              </FormHelperText>
            </FormGroup>
            <TextField
              label="Confirmar Senha"
              variant="outlined"
              fullWidth
              required
              value={passwordConfirm}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((current) => !current)}
                      onMouseDown={(
                        event: React.MouseEvent<HTMLButtonElement>
                      ) => {
                        event.preventDefault();
                      }}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                setPasswordConfirmError("");
                setPasswordConfirm(event.target.value);
              }}
              error={!!passwordConfirmError.length}
              helperText={passwordConfirmError}
            />
          </>
        )}

        <SectionSpace />
        <SectionTitle text="Suas habilidades" />
        <Stack direction="row" gap="16px">
          <Box flexGrow={1}>
            <Autocomplete
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="outlined-basic"
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
                id="outlined-basic"
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
                id="outlined-basic"
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
                id="outlined-basic"
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
        <SectionSpace />
        <Stack direction="row" color="#00000070" gap="8px" alignItems="center">
          <SectionTitle text="Educação" />
          <EducationDialog />
          <AddCircleOutlineIcon
            onClick={() => {
              setShowEducationDialog(true);
            }}
            style={{ fontSize: "1em", color: PRIMARY_COLOR, cursor: "pointer" }}
          />
        </Stack>
        {!!addedEducations.length && (
          <Stack direction="column" gap="8px">
            {addedEducations.map((education: Education) => {
              return (
                <EducationFields
                  key={`${education.course}-${education.institution}`}
                  education={education}
                />
              );
            })}
          </Stack>
        )}

        <SectionSpace />
        <Stack direction="row" color="#00000070" gap="8px" alignItems="center">
          <SectionTitle text="Profissional" />
          {JobDialog()}
          <AddCircleOutlineIcon
            onClick={() => {
              setShowJobDialog(true);
            }}
            style={{ fontSize: "1em", color: PRIMARY_COLOR, cursor: "pointer" }}
          />
        </Stack>
        {!!addedJobs.length && (
          <Stack direction="column" gap="8px">
            {addedJobs.map((job: Job) => {
              return (
                <JobFields
                  key={`${job.companyName}-${job.roleName}-${job.startDate}`}
                  job={job}
                />
              );
            })}
          </Stack>
        )}

        <SectionSpace />
        <SectionTitle text="Links" />
        <TextField
          label="LinkedIn"
          variant="outlined"
          fullWidth
          required
          value={social.linkedin}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            const social = {
              ...personalData,
              linkedin: event.target.value,
            };

            setSocial(social);
          }}
          error={!!socialErrors.linkedin?.length}
          helperText={socialErrors.linkedin}
        />
        <TextField
          label="Site pessoal"
          variant="outlined"
          fullWidth
          value={social.personalWebsite}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            const social = {
              ...personalData,
              personalWebsite: event.target.value,
            };

            setSocial(social);
          }}
          error={!!socialErrors.personalWebsite?.length}
          helperText={socialErrors.personalWebsite}
        />
        <TextField
          label="Instagram"
          variant="outlined"
          fullWidth
          value={social.instagram}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            const social = {
              ...personalData,
              instagram: event.target.value,
            };

            setSocial(social);
          }}
          error={!!socialErrors.instagram?.length}
          helperText={socialErrors.instagram}
        />
        <TextField
          label="Git"
          variant="outlined"
          fullWidth
          value={social.git}
          onChange={(
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            const social = {
              ...personalData,
              git: event.target.value,
            };

            setSocial(social);
          }}
          error={!!socialErrors.git?.length}
          helperText={socialErrors.git}
        />

        {!!submitError.length && (
          <Box color="red" fontSize="0.8em" textAlign="center">
            {submitError}
          </Box>
        )}
        <Box mt="16px">
          <Button
            fullWidth
            variant="contained"
            onClick={isEditing ? updateTalentData : signUp}
          >
            {isLoading ? (
              <CircularProgress size="24px" style={{ color: "white" }} />
            ) : isEditing ? (
              "Atualizar conta"
            ) : (
              "Criar conta"
            )}
          </Button>
        </Box>
        <Box textAlign="center">
          Já tem conta? <Link to={"/account"}>Entre aqui</Link>
        </Box>
      </Stack>
    </Box>
  );
};

export default Account;
