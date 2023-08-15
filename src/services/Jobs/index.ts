import { AxiosResponse } from "axios";
import api from "../../config/axios";
import { Job } from "../../models/jobs";
import { ApiResult } from "../../models/talents";

export const createJob = async (
  job: Job,
  onSuccess?: (jobCreated: Job) => void,
  onError?: (error: any) => void
) => {
  return api
    .post("/job", job)
    .then((response: AxiosResponse) => {
      const result: ApiResult = response.data;
      const job = result.data;

      if (onSuccess) onSuccess(job);
    })
    .catch((error) => {
      console.error(`[${error.code}] Erro ao buscar talento: `, error.message);
      if (onError) onError(error);
    });
};
