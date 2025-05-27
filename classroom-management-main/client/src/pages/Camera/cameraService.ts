import axiosClient from "../../services/axiosClient";

const cameraService = {
  getAllCamera: () => {
    const url = "/camera";
    return axiosClient.get(url);
  },
  updateCamera: (id: string, payload: any) => {
    const url = `/camera/${id}`;
    return axiosClient.put(url, payload);
  },
  deleteCamera: (id: string) => {
    const url = `/camera/${id}`;
    return axiosClient.delete(url);
  },
  addCamera: (payload: any) => {
    const url = `/camera`;
    return axiosClient.post(url, payload);
  },
  importCamera: (file: any) => {
    const url = `/camera/import`;
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(url, formData);
  },
  exportCamera: () => {
    const url = "/camera/export";
    return axiosClient
      .get(url, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Camera.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return Promise.resolve();
      })
      .catch((error) => Promise.reject(error));
  },
};

export default cameraService;
