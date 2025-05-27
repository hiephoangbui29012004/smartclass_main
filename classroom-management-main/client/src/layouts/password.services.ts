import axiosClient from "../services/axiosClient";

const passwordService = {
  changePass: (body: any) => {
    return axiosClient.post("/account/changePass", body);
  },
};
export default passwordService;
