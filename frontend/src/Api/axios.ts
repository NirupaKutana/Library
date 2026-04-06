import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("access_token");

  // console.log("TOKEN SENT:", token);

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  // console.log("header",config.headers)
  return config;
});

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if ([401,403].includes(error.response?.status)) {

      originalRequest._retry = true;
    
      try {
        const refresh = localStorage.getItem("refresh_token");

        const response = await axios.post(
          "http://127.0.0.1:8000/token/refresh/",
          { refresh_token: refresh }
        );

        const newAccess = response.data.access_token;

        // save new token
        localStorage.setItem("access_token", newAccess);

        // attach new token
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccess}`
        );

        return API(originalRequest);

      } catch (refreshError:any) {
        console.log("REFRESH FAILED:",refreshError.response?.data);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;