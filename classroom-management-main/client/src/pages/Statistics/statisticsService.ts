import axiosClient from "../../services/axiosClient";

const statisticsService = {
  getStatistics: (payload: any) => {
    const url = "/statistics";
    return axiosClient.post(url, payload);
  },
  drawChart: (payload: any) => {
    const url = "/statistics/drawActionChart";
    return axiosClient.post(url, payload);
  },
  downloadImage: (id: any) => {
    const url = `/image/file/${id}`;
    return axiosClient.get(url, { responseType: "blob" });
  },
  exportExcel: (payload: any) => {
    const url = "/statistics/export";
    return axiosClient
      .post(url, payload, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Report.xlsx"); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return Promise.resolve();
      })
      .catch((error) => Promise.reject(error));
  },
  getVideos: (payload: any) => {
    const url = "/statistics/videos";
    return axiosClient.post(url, payload);
  },
  getVideoFrames: (videoId: number) => {
    const url = `/statistics/video-frames/${videoId}`;
    return axiosClient.get(url);
  }
};

export default statisticsService;