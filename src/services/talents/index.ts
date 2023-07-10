import { AxiosResponse } from "axios";
import api from "../../config/axios";
import {
  ApiResult,
  Talent,
  GetTalentQuery,
  TalentSearchQuery,
} from "../../types";

export const queryTalents = async (
  query: TalentSearchQuery,
  pageSize = 10,
  pageNumber = 1
) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();
  return api.get(
    `/talents/query?pageSize=${pageSize}&pageNumber=${pageNumber}&${queryString}`
  );
};

export const getTalents = async () => {
  return api.get("/talents");
};

export const getTalent = async (
  talentsQuery: GetTalentQuery,
  onSuccess?: (talent: Talent) => void,
  onError?: (error: any) => void
) => {
  const queryString = new URLSearchParams(
    talentsQuery as Record<string, string>
  ).toString();

  return api
    .get(`/talents/search?${queryString}`)
    .then((response: AxiosResponse) => {
      const result: ApiResult = response.data;
      const talent = result.data;

      if (onSuccess) onSuccess(talent);
    })
    .catch((error) => {
      console.error(`[${error.code}] Erro ao buscar talento: `, error.message);
      if (onError) onError(error);
    });
};

export const createTalent = async (
  talent: Talent,
  onSuccess?: (talentCreated: Talent) => void,
  onError?: (error: any) => void
) => {
  return api
    .post("/talents", talent)
    .then((response: AxiosResponse) => {
      const result: ApiResult = response.data;
      const talent = result.data;

      if (onSuccess) onSuccess(talent);
    })
    .catch((error) => {
      console.error(`[${error.code}] Erro ao buscar talento: `, error.message);
      if (onError) onError(error);
    });
};

export const updateTalent = async (
  talent: Talent,
  onSuccess?: (talentUpdated: Talent) => void,
  onError?: (error: any) => void
) => {
  return api
    .put("/talents", talent)
    .then((response: AxiosResponse) => {
      const result: ApiResult = response.data;
      const talent = result.data;

      if (onSuccess) onSuccess(talent);
    })
    .catch((error) => {
      console.error(`[${error.code}] Erro ao buscar talento: `, error.message);
      if (onError) onError(error);
    });
};

export const deleteTalent = async (talentId: string) => {
  return api.delete(`/talents/${talentId}`);
};
