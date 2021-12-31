import axios, { AxiosRequestConfig } from "axios";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AUTH_KEY, useAuth } from "./auth";

export const useApi = (endpoint: string, access_token?: string) => {
  const urlProd = "https://financial-record.herokuapp.com/";
  const urlDev = "http://localhost:3333/";

  // Axios Config
  const api = axios.create({
    baseURL: urlProd,
    headers: {
      Authorization: access_token ? `Bearer ${access_token}` : ``,
    },
  });

  // Init State
  const data = ref();
  const loading = ref(false);
  const error = ref();
  const status = ref();

  // Post
  const post = async (payload?: Record<string, any>) => {
    loading.value = true;
    error.value = undefined;

    try {
      try {
        const res = await api.post(endpoint, payload);
        return (data.value = res.data);
      } catch (e) {
        error.value = e;
        throw e;
      }
    } finally {
      return (loading.value = false);
    }
  };

  // Get
  const get = async (
    query?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => {
    loading.value = true;
    error.value = undefined;

    let queryString = "";
    if (query) {
      queryString =
        "?" +
        Object.entries(query)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");
    }

    try {
      try {
        const res = await api.get(endpoint + queryString, config);
        return (data.value = res.data);
      } catch (e) {
        error.value = e;
        throw e;
      }
    } finally {
      return (loading.value = false);
    }
  };

  // Put
  const put = async (payload?: Record<string, any>) => {
    loading.value = true;
    error.value = undefined;

    try {
      try {
        const res = await api.put(endpoint, payload);
        return (data.value = res.data);
      } catch (e) {
        error.value = e;
        throw e;
      }
    } finally {
      return (loading.value = false);
    }
  };

  // Error Message
  const errorMessage = computed(() => {
    if (error.value) {
      return error.value;
    }
  });

  // Error Details
  const errorDetails = computed(() => {
    if (error.value && error.value.response) {
      return error.value.response.data.message;
    }
  });

  // Error Fields
  const errorFields = computed(() => {
    if (error.value && Array.isArray(error.value.response.data.message)) {
      return (error.value.response.data.message as string[]).reduce(
        (acc: Record<string, any>, msg: string) => {
          let [field] = msg.split(" ");

          if (!acc[field]) {
            acc[field] = [];
          }

          acc[field].push(msg);

          return acc;
        },
        {}
      );
    }
  });

  // Interceptors Config
  const { user } = useAuth();
  const router = useRouter();

  api.interceptors.request.use((config) => {
    if (user?.value?.token) {
      config.headers = { Authorization: `Bearer ${user.value.token}` };
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;

      if (status === 422) {
        errorMessage;
      } else if (status === 401) {
        router.replace("/login");
        localStorage.removeItem(AUTH_KEY);
        loading.value = false;
      }

      return Promise.reject(error);
    }
  );

  return {
    loading,
    error,
    data,
    useApi,
    post,
    get,
    errorMessage,
    errorDetails,
    errorFields,
  };
};
