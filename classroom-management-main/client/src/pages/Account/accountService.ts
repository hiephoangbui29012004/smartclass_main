import axiosClient from "../../services/axiosClient";

const accountService = {
  getAllAccount: () => {
    const url = "/account";
    return axiosClient.get(url);
  },
  updateAccount: (id: string, payload: any) => {
    const url = `/account/${id}`;
    return axiosClient.put(url, payload);
  },
  deleteAccount: (id: string) => {
    const url = `/account/${id}`;
    return axiosClient.delete(url);
  },
  addAccount: (payload: any) => {
    const url = `/account`;
    return axiosClient.post(url, payload);
  },
  resetPassword: (id: string) => {
    const url = `/account/reset-password/${id}`;
    return axiosClient.get(url);
  },
  importAccount: (file: any) => {
    const url = `/account/import`;
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(url, formData);
  },
  exportAccount: () => {
    const url = "/account/export";
    return axiosClient
      .get(url, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Account.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return Promise.resolve();
      })
      .catch((error) => Promise.reject(error));
  },
};

export default accountService;
