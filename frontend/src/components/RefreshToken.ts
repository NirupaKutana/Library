import axios from "axios";
import { toast } from "react-toastify";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  // console.log("Refresh token:", refreshToken);

  if (!refreshToken) {
    console.log("No refresh token found");
    logout();
    return null;
  }

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/token/refresh/",
      { refresh_token: refreshToken }
    );
    console.log("Refresh success:", res.data);
    localStorage.setItem("access_token", res.data.access_token);
    return res.data.access_token;

  } catch(err:any) {
    console.log(" Refresh failed:", err.response?.data);
    toast.error(`${err.response?.data?.error}`)
    logout();
    return null;
  }
};

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
