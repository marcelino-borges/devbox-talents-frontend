export interface Talent {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  authId: string;
  isAdmin?: boolean;
  languages?: Skill[];
  frameworks?: Skill[];
  databases?: Skill[];
  otherSkills?: Skill[];
  jobHistory?: Job[];
  educationHistory?: Education[];
  social: {
    personalWebsite?: string;
    linkedin: string;
    instagram?: string;
    git?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Job {
  companyName: string;
  roleName: string;
  employmentType: EmploymentType;
  location: string;
  locationType: LocationType;
  currentEmployment: boolean;
  startDate: Date;
  endDate?: Date;
  description: string;
  skills: Skill[];
}

export interface Education {
  institution: string;
  course: string;
  start: Date;
  end?: Date;
}

export enum EmploymentType {
  FULL_TIME,
  PART_TIME,
  SELF_EMPLOYED,
  FREELANCE,
  CONTRACT,
  INTERNSHIP,
  APPRENTICESHIP,
}

export enum LocationType {
  REMOTE,
  ONSITE,
  HYBRID,
}

export interface GetTalentQuery {
  id?: string;
  email?: string;
  authId?: string;
}

export interface TalentSearchQuery {
  freeText?: string;
  name?: string;
  email?: string;
  languages?: string;
  frameworks?: string;
  databases?: string;
  otherSkills?: string;
}

export interface Skill {
  label: string;
  value: string;
}

export interface ApiResult {
  message: string;
  data: any;
}
