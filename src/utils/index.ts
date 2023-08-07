import { SeniorityLevel } from "../models/jobs";
import { EmploymentType, LocationType, Skill } from "../models/talents";

export const translateEmploymentType = (type: EmploymentType) => {
  switch (type) {
    case EmploymentType.APPRENTICESHIP:
      return "Menor aprendiz";
    case EmploymentType.CONTRACT:
      return "Contrato temporário";
    case EmploymentType.FREELANCE:
      return "Freelancer";
    case EmploymentType.FULL_TIME:
      return "Full time";
    case EmploymentType.PART_TIME:
      return "Part time";
    case EmploymentType.INTERNSHIP:
      return "Estágio";
    case EmploymentType.SELF_EMPLOYED:
      return "Empreendedor/Autônomo";
    default:
      return "Desconhecido";
  }
};

export const translateLocationType = (type: LocationType) => {
  switch (type) {
    case LocationType.HYBRID:
      return "Híbrido";
    case LocationType.ONSITE:
      return "Presencial";
    case LocationType.REMOTE:
      return "Remoto";
    default:
      return "Desconhecido";
  }
};

export const joinSkills = (skills: Skill[]): string => {
  return skills
    .map((skill: Skill, index: number) => {
      return (
        skill.label +
        `${
          index === skills.length - 2
            ? " e "
            : index < skills.length - 1
            ? ", "
            : "."
        }`
      );
    })
    .join("");
};

export const translateSeniorityLevel = (type: SeniorityLevel) => {
  switch (type) {
    case SeniorityLevel.INTERN:
      return "Estagiário";
    case SeniorityLevel.TREINEE:
      return "Treinee";
    case SeniorityLevel.JUNIOR:
      return "Programador Junior";
    case SeniorityLevel.MID:
      return "Programador Pleno";
    case SeniorityLevel.SENIOR:
      return "Programador Senior";
    case SeniorityLevel.LEAD:
      return "Lead";
    case SeniorityLevel.MANAGER:
      return "Programador Gerente";
    case SeniorityLevel.DIRECTOR:
      return "Diretor";
    case SeniorityLevel.CLEVEL:
      return "C-level executive";
  }
};
