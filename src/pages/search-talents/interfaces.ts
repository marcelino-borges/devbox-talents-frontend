import { Skill } from "../../models/talents";

export interface TalentSummary {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  languages?: Skill[];
  frameworks?: Skill[];
  databases?: Skill[];
  otherSkills?: Skill[];
}
