import axiosClient from "../../services/axiosClient";

const classroomService = {
  getAllRoom: () => {
    const url = "/classroom";
    return axiosClient.get(url);
  },
  getRoomById: (id: string | any) => {
    const url = `/classroom/${id}`;
    return axiosClient.get(url);
  },
  updateRoom: (id: string, payload: any) => {
    const url = `/classroom/${id}`;
    return axiosClient.put(url, payload);
  },
  deleteRoom: (id: string) => {
    const url = `/classroom/${id}`;
    return axiosClient.delete(url);
  },
  addRoom: (payload: any) => {
    const url = `/classroom`;
    return axiosClient.post(url, payload);
  },
  importRoom: (file: any) => {
    const url = `/classroom/import`;
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(url, formData);
  },
  exportRoom: () => {
    const url = "/classroom/export";
    return axiosClient
      .get(url, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Rooms.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return Promise.resolve();
      })
      .catch((error) => Promise.reject(error));
  },
};

export default classroomService;
