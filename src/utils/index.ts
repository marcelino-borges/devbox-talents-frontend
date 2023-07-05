import { EmploymentType, LocationType } from "../types";

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
