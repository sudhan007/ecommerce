import _axios from "axios";
import { config } from "./config";

const axios = _axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

export { axios };
