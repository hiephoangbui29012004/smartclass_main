import axiosClient from "../../services/axiosClient";

const actionService = {
  getAllAction: () => {
    const url = "/activity";
    return axiosClient.get(url);
  },
  getAction: (id: string | any) => {
    const url = `/activity/${id}`;
    return axiosClient.get(url);
  },
  updateAction: (id: string, payload: any) => {
    const url = `/activity/${id}`;
    return axiosClient.put(url, payload);
  },
  deleteAction: (id: string) => {
    const url = `/activity/${id}`;
    return axiosClient.delete(url);
  },
  addAction: (payload: any) => {
    const url = `/activity`;
    return axiosClient.post(url, payload);
  },
  importAction: (file: any) => {
    const url = `/activity/import`;
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(url, formData);
  },
  exportAction: () => {
    const url = "/activity/export";
    return axiosClient
      .get(url, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Activity.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return Promise.resolve();
      })
      .catch((error) => Promise.reject(error));
  },
};

export default actionService;
