import api from "../../config/axios";
import { Talent, TalentQuery } from "../../types";

export const queryTalents = async (
  query: string,
  pageSize = 10,
  pageNumber = 1
) => {
  return api.get(
    `/talents/query?q=${query}&pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
};

export const getTalents = async () => {
  return api.get("/talents");
};

export const getTalent = async (talentsQuery: TalentQuery) => {
  const queryString = new URLSearchParams(
    talentsQuery as Record<string, string>
  ).toString();

  return api.get(`/talents/search?${queryString}`);
};

export const createTalent = async (talent: Talent) => {
  return api.post("/talents", talent);
};

export const updateTalent = async (talent: Talent) => {
  return api.put("/talents", talent);
};

export const deleteTalent = async (talentId: string) => {
  return api.delete(`/talents/${talentId}`);
};
