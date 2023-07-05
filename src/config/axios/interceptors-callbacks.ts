import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { getStorage } from "../../utils/storage";
import { TOKEN_STORAGE_KEY } from "../../constants";

export const onSendRequest = async (config: any): Promise<any> => {
  const updatedConfig: AxiosRequestConfig = {
    ...config,
  };

  const token = getStorage(TOKEN_STORAGE_KEY);

  if (token?.length) {
    updatedConfig.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // console.log(
  //   `\n\n
  //   🌍 [AXIOS REQUEST] [${updatedConfig.method?.toUpperCase()}] [${
  //     updatedConfig.url
  //   }]
  //   \n\n
  //   Headers: ${JSON.stringify(updatedConfig.headers)}\n
  //   Body: ${JSON.stringify(updatedConfig.data ?? "null")}\n
  //   Params: ${JSON.stringify(updatedConfig.params ?? "null")}\n`
  // );

  return updatedConfig;
};

export const onReceiveResponse = async (response: AxiosResponse) => {
  // console.log(
  //   `\n\n${response.status < 400 ? "✅" : "⛔"} [AXIOS RESPONSE] [Status: ${
  //     response.status
  //   }] [${response.config.method?.toUpperCase()}] [${
  //     response.config.url
  //   }] Data:\n${JSON.stringify(response.data)}\n_`
  // );

  return response;
};

export const onSendRequestError = (error: AxiosError) => {
  // console.log(
  //   `\n\n⛔ [AXIOS REQUEST ERROR] Unknown error: \n${JSON.stringify(error)}\n_`
  // );
  return Promise.reject(error);
};

export const onResponseError = async (error: AxiosError) => {
  if (!error || !error.response || !error.response.data) {
    // console.log(
    //   `\n\n⛔ [AXIOS RESPONSE ERROR] Unknown error: \n${JSON.stringify(
    //     error
    //   )}\n_`
    // );

    return Promise.reject(error);
  }

  // console.log(
  //   `\n\n⛔ [AXIOS RESPONSE ERROR] [Status: ${
  //     error.response.status
  //   }] [${error.response.config.method?.toUpperCase()}] [${
  //     error.response.config.url
  //   }] Data:\n${JSON.stringify(error.response.data)}\n_`
  // );

  return Promise.reject(error);
};
