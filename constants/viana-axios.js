import Axios from "axios";
import { Constants } from "@/constants/global-constants";
import { baseURLs } from "@/plugins/config";

let pendingRequests = [];

const addPendingRequest = (config) => {
  const source = Axios.CancelToken.source();
  config.cancelToken = source.token;
  pendingRequests.push({ config, cancel: source.cancel });
  return config;
};

const removePendingRequest = (config) => {
  pendingRequests = pendingRequests.filter((req) => req.config !== config);
};

export const cancelPendingRequests = () => {
  pendingRequests.forEach((req) => req.cancel("Request canceled by user"));
  pendingRequests = [];
};

const VianaAxios = Axios.create({
  baseURL: "",
  timeout: 60000,
});

const onRequest = (config) => {
  // const urlPath = `BASE_URL_${localeProps?.code?.toUpperCase() ?? "FA"}`;
  const urlPath = `BASE_URL_FA`;
  if (!config?.baseURL) config.baseURL = baseURLs[urlPath] ?? "";

  const storageToken =
    typeof window !== "undefined"
      ? localStorage?.getItem(`${Constants.STORE_KEY}-token`)
      : null;

  if (storageToken && !config?.headers?.Authorization) {
    let parsedToken = JSON.parse(storageToken);
    config.headers.Authorization = `Bearer ${parsedToken.access_token}`;
  } else if (config?.headers?.Authorization && !storageToken)
    config.headers.Authorization = "";

  if (config.method == "patch" || config.method == "put") {
    if (config.data instanceof FormData)
      config.data.append("_method", config.method);
    else if (typeof config.data == "object")
      config.data["_method"] = config.method;

    config.method = "post";
  }

  config.url = encodeURI(config.url); // SSR

  return addPendingRequest(config);
};

const onRequestError = (error) => {
  return Promise.reject(error);
};

const onResponse = (response) => {
  console.log(response.config.url, response.data.data || response.data);
  removePendingRequest(response.config);
  return response;
};

const onResponseError = (error) => {
  console.log(error, error?.response || "");
  if (Axios.isCancel(error)) {
    return;
  }

  if (error?.response?.status === 401) {
    let storageToken = localStorage.getItem(`${Constants.STORE_KEY}-token`);
    storageToken = JSON.parse(storageToken);

    if (!VianaAxios.defaults.headers.common["Authorization"]) {
      VianaAxios.defaults.headers.common["Authorization"] =
        "Bearer " + storageToken.access_token;

      error.config.headers.Authorization =
        "Bearer " + storageToken.access_token;

      return VianaAxios.request(error.config);
    } else {
      // store.commit("exit");
      // window.location.replace("//" + window.location.host);
      // return services.auth
      //   .refreshToken(storageToken)
      //   .then((token) => {
      //     localStorage.removeItem(`${Constants.STORE_KEY}-token`);
      //     localStorage.setItem(`${Constants.STORE_KEY}-token`, JSON.stringify(token));
      //     console.log(token);
      //     store.commit("setToken", token);
      //     VianaAxios.defaults.headers.common["Authorization"] =
      //       "Bearer " + token.access_token;
      //     error.config.headers.Authorization =
      //       "Bearer " + token.access_token;
      //     console.warn(error.config);
      //     return VianaAxios.request(error.config);
      //   })
      //   .catch((tokenerror) => {
      //     return Promise.reject(tokenerror);
      //   });
    }
  }

  removePendingRequest(error.config);

  return Promise.reject(error);
};

VianaAxios.interceptors.request.use(onRequest, onRequestError);
VianaAxios.interceptors.response.use(onResponse, onResponseError);

export default VianaAxios;
