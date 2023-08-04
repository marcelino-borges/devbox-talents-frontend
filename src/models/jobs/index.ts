import { EmploymentType, LocationType, Skill } from "../talents";

export interface Job {
  _id?: string;
  creatorId: any;
  companyName: string;
  roleName: string;
  employmentType: EmploymentType;
  companyLocation: string;
  locationType: LocationType;
  description: string;
  mandatoryRequirements: string;
  preferredRequirements: string;
  mandatorySkills: Skill[];
  preferredSkills: Skill[];
  seniorityLevel: SeniorityLevel;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum SeniorityLevel {
  INTERN = 0,
  TREINEE = 1,
  JUNIOR = 2,
  MID = 3,
  SENIOR = 4,
  LEAD = 5,
  MANAGER = 6,
  DIRECTOR = 7,
  CLEVEL = 8,
}

export interface JobQuery {
  roleName?: string;
  employmentType?: EmploymentType;
  locationType?: LocationType;
  mandatorySkills?: string;
  preferredSkills?: string;
  seniorityLevel?: SeniorityLevel;
  pageSize?: number;
  pageNumber?: number;
}