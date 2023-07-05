import axios from "axios";
import {
  onReceiveResponse,
  onResponseError,
  onSendRequest,
  onSendRequestError,
} from "./interceptors-callbacks";

const BASE_URL = import.meta.env.VITE_TALENTS_API;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(onSendRequest, onSendRequestError);
api.interceptors.response.use(onReceiveResponse, onResponseError);

export default api;
