import axiosClient from "../../services/axiosClient";

const authService = {
  login: (payload: any) => {
    const url = "/auth/login";
    return axiosClient.post(url, payload);
  },
  register: (payload: any) => {
    const url = "/auth/register";
    return axiosClient.post(url, payload);
  },
};

export default authService;
