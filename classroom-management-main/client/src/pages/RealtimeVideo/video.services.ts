import axiosClient from "../../services/axiosClient";

const videoService = {
  getStream: (id: number) => {
    const url = `/stream/${id}`;
    return axiosClient.get(url);
  },
};

export default videoService;