import React, { useEffect, useState } from "react";
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
import { format, isValid } from "date-fns";
import { Link, useNavigate, useParams } from "react-router-dom";
import { User } from "firebase/auth";
import {
  DATABASES,
  EMAIL_VALIDATOR,
  FRAMEWORKS,
  LANGUAGES,
  OTHER_SKILLS,
  PASSWORD_VALIDATOR,
  TOKEN_STORAGE_KEY,
  FIREBASE_USER_STORAGE_KEY,
  TALENT_STORAGE_KEY,
  MAX_APP_WIDTH,
} from "../../constants";
import {
  Education,
  EmploymentType,
  Job,
  LocationType,
  Skill,
  Talent,
} from "../../types";
import { PRIMARY_COLOR } from "../../constants/colors";
import { translateEmploymentType, translateLocationType } from "../../utils";
import { createTalent, getTalent, updateTalent } from "../../services/talents";
import { createAccount, deleteAccount } from "../../services/auth";
import { getStorage, setStorage } from "../../utils/storage";
import { translateFirebaseError } from "../../utils/firebase";
import JobCard from "../../components/job-card";
import EducationCard from "../../components/education-card";
import { ROUTING_PATH } from "../../routes/routes";
import Footer from "../../components/footer";

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
  authId: string;
}

const EMPTY_PERSONAL_DATA: PersonalData = {
  firstName: "",
  lastName: "",
  email: "",
  authId: "",
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
  const [errorGetTalent, setErrorGetTalent] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authId) {
      if (!getStorage(TOKEN_STORAGE_KEY)?.length) {
        navigate(ROUTING_PATH.LOGIN);
        return;
      }
      setIsEditing(true);
      getTalentDataAndFillForm(authId);
    }
  }, [authId, navigate]);

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
        setStorage(FIREBASE_USER_STORAGE_KEY, JSON.stringify(user));

        const newTalent: Talent = {
          authId: user.uid,
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
            navigate(`${ROUTING_PATH.PROFILE}/${user.uid}`);
          })
          .catch((error: any) => {
            const message = error.response.data.message;
            console.error(message);
            setSubmitError("Erro ao criar seu perfil.");
            deleteAccount();
          });
      },
      (error: any) => {
        setIsLoading(false);
        const translatedError = translateFirebaseError(error.message);
        console.error(translatedError);
        if (translatedError) setSubmitError(translatedError);
        else setSubmitError("Erro ao criar sua conta.");
      }
    );
  };

  const updateTalentData = () => {
    if (!validateFormData()) return;

    setIsLoading(true);

    const talent: Talent = {
      authId: personalData.authId,
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

    updateTalent(talent, (talentUpdated: Talent) => {
      setIsLoading(false);
      setStorage(TALENT_STORAGE_KEY, JSON.stringify(talentUpdated));
      navigate(`${ROUTING_PATH.PROFILE}/${personalData.authId}`);
    })
      .then()
      .catch((error: any) => {
        setIsLoading(false);
        const translatedError = translateFirebaseError(error.message);
        console.error(translatedError);
        if (translatedError) setSubmitError(translatedError);
        else setSubmitError("Erro ao atualizar sua conta.");
      });
  };

  const getTalentDataAndFillForm = (talentId: string) => {
    setIsLoading(true);
    getTalent(
      { authId: talentId },
      (talent: Talent) => {
        if (talent) {
          setAddedLanguages(talent.languages ?? []);
          setAddedDatabases(talent.databases ?? []);
          setAddedFrameworks(talent.frameworks ?? []);
          setAddedEducations(talent.educationHistory ?? []);
          setAddedOtherSkills(talent.otherSkills ?? []);
          setAddedJobs(talent.jobHistory ?? []);
          setSocial(talent.social);
          const personalData: PersonalData = {
            firstName: talent.firstName,
            lastName: talent.lastName,
            email: talent.email,
            authId: talent.authId,
          };
          setPersonalData(personalData);
        }
        setIsLoading(false);
      },
      () => {
        setErrorGetTalent("Erro ao buscar seus dados");
        setIsLoading(false);
      }
    );
  };

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

  const deleteEducation = (education: Education) => {
    const filteredEducations = addedEducations.filter(
      (existingEducation: Education) =>
        education.course !== existingEducation.course &&
        education.institution !== existingEducation.institution &&
        education.start !== existingEducation.start &&
        education.end !== existingEducation.end
    );

    setAddedEducations(filteredEducations);
  };

  const deleteJob = (job: Job) => {
    const filteredJobs = addedJobs.filter(
      (existingJob: Job) =>
        job.companyName !== existingJob.companyName &&
        job.roleName !== existingJob.roleName &&
        job.startDate !== existingJob.startDate
    );

    setAddedJobs(filteredJobs);
  };

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
    const [error, setError] = useState("");

    const resetDialog = () => {
      setEducationToAdd(EMPTY_EDUCATION);
      setHasEnded(false);
      setError("");
    };

    const onClose = () => {
      resetDialog();
      closeEducationDialog();
    };

    const onSubmitEducation = (event: any) => {
      event.preventDefault();

      setError("");

      if (hasEnded && !isValid(educationToAdd.end)) {
        setError("Data de término inválida");
        return;
      }

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

        setAddedEducations([...addedEducations, updated]);
        onClose();
      }
    };

    return (
      <Dialog open={showEducationDialog} onClose={onClose} fullWidth>
        <form onSubmit={onSubmitEducation}>
          <DialogTitle>Adicionar Educação</DialogTitle>
          <DialogContent style={{ padding: "16px" }}>
            <Stack direction="column" gap="16px">
              <TextField
                label="Instituição"
                variant="outlined"
                fullWidth
                required
                value={educationToAdd?.institution}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!educationToAdd) return;

                  const educ = {
                    ...educationToAdd,
                    institution: event.target.value,
                  };
                  setEducationToAdd(educ);
                }}
              />
              <TextField
                label="Curso"
                variant="outlined"
                fullWidth
                required
                value={educationToAdd?.course}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!educationToAdd) return;

                  const educ = {
                    ...educationToAdd,
                    course: event.target.value,
                  };
                  setEducationToAdd(educ);
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasEnded}
                    onChange={(_: any, checked: boolean) =>
                      setHasEnded(checked)
                    }
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

                    setEducationToAdd(educ);
                  }}
                />
                <DatePicker
                  disabled={!hasEnded}
                  label="Data de término"
                  value={educationToAdd?.end}
                  onChange={(newValue: any) => {
                    if (!educationToAdd) return;

                    const educ = {
                      ...educationToAdd,
                      end: new Date(newValue),
                    };

                    setEducationToAdd(educ);
                  }}
                />
              </Stack>
            </Stack>
            <Box height="40px" color="red" fontSize="0.8em" mt="16px">
              {error}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">Adicionar</Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  const JobDialog = () => {
    const [jobToAdd, setJobToAdd] = useState<Job>(EMPTY_PROFESSION);
    const [addedJobSkills, setAddedJobSkills] = useState<Skill[]>([]);
    const [jobSkillToAdd, setJobSkillToAdd] = useState<Skill>();

    const resetDialog = () => {
      setJobToAdd(EMPTY_PROFESSION);
      setJobSkillToAdd(undefined);
      setAddedJobSkills([]);
    };

    const onSubmitJob = (event: any) => {
      event.preventDefault();

      if (
        jobToAdd &&
        jobToAdd.companyName?.length &&
        jobToAdd.location?.length &&
        jobToAdd.description?.length &&
        jobToAdd.roleName?.length
      ) {
        const updated: Job = {
          ...jobToAdd,
          skills: addedJobSkills,
        };

        if (jobToAdd.currentEmployment) {
          updated.endDate = undefined;
        }

        setAddedJobs([...addedJobs, updated]);
        onClose();
      }
    };

    const onClose = () => {
      closeProfessionalDialog();
      resetDialog();
    };

    return (
      <Dialog open={showJobDialog} onClose={onClose} fullWidth>
        <DialogTitle>Adicionar Experiência</DialogTitle>
        <form onSubmit={onSubmitJob}>
          <DialogContent style={{ padding: "16px" }}>
            <Stack direction="column" gap="16px">
              <TextField
                label="Empresa"
                variant="outlined"
                fullWidth
                required
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
                required
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
              <TextField
                label="Localização"
                variant="outlined"
                fullWidth
                required
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
                        {translateLocationType(
                          LocationType[type as any] as any
                        )}
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
                      end: new Date(newValue),
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
                required
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
                            (skill: Skill) =>
                              skill.value === jobSkillToAdd.value
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
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">Adicionar</Button>
          </DialogActions>
        </form>
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
    <Stack
      id="welcome-root"
      direction="column"
      justifyContent="center"
      alignItems="center"
      pb="100px"
      pt="50px"
    >
      <Stack
        id="welcome-fields"
        direction="column"
        maxWidth="1140px"
        width="100%"
        justifyContent="center"
        gap="16px"
      >
        <Box textAlign="center" fontWeight={800}>
          <h2>{isEditing ? "Editar conta" : "Criar conta"}</h2>
        </Box>
        {!isEditing && (
          <Box fontSize="0.8em" marginBottom="32px" textAlign="center">
            Cadastre-se no nosso banco de talentos para receber propostas para
            nossas próximas vagas.
          </Box>
        )}
        {!!errorGetTalent.length && (
          <Stack
            direction="column"
            pb="50px"
            fontSize="0.8em"
            alignItems="center"
            color={PRIMARY_COLOR}
          >
            {errorGetTalent}
            <a href="#" onClick={() => location.reload()}>
              ATUALIZAR PÁGINA
            </a>
          </Stack>
        )}
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
        <SectionSpace />
        <Stack direction="row" color="#00000070" gap="8px" alignItems="center">
          <SectionTitle text="Educação" />
          <EducationDialog />
          <AddCircleOutlineIcon
            onClick={() => {
              setShowEducationDialog(true);
            }}
            style={{
              fontSize: "1em",
              color: PRIMARY_COLOR,
              cursor: "pointer",
            }}
          />
        </Stack>
        {!!addedEducations.length && (
          <Stack direction="column" gap="8px">
            {addedEducations.map((education: Education) => {
              return (
                <EducationCard
                  key={`${education.course}-${education.institution}`}
                  education={education}
                  deleteEducation={deleteEducation}
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
            style={{
              fontSize: "1em",
              color: PRIMARY_COLOR,
              cursor: "pointer",
            }}
          />
        </Stack>
        {!!addedJobs.length && (
          <Stack direction="column" gap="8px">
            {addedJobs.map((job: Job) => {
              return (
                <JobCard
                  key={`${job.companyName}-${job.roleName}-${job.startDate}`}
                  job={job}
                  deleteJob={deleteJob}
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
        <Box>
          Ao clicar no botão Criar Conta, aceito os{" "}
          <Link to={"/terms-of-use"}>Termos de Uso</Link> e as{" "}
          <Link to={"/privacy-policy"}>Políticas de Privacidade</Link> da Devbox
        </Box>
        <Box mt="16px">
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setErrorGetTalent("");

              if (isEditing) {
                updateTalentData();
              } else {
                signUp();
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size="24px" style={{ color: "white" }} />
            ) : isEditing ? (
              "Salvar"
            ) : (
              "Criar conta"
            )}
          </Button>
        </Box>
        {!isEditing && (
          <Box textAlign="center" mt="16px">
            Já tem conta? <Link to={"/login"}>Entre aqui</Link>
          </Box>
        )}
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

export default Account;
