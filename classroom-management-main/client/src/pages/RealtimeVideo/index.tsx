/* eslint-disable */
import {
  Button,
  createStyles,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
} from "@material-ui/core";
import React from "react";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import IconImage from "../../components/IconImage";
import PageHeader from "../../components/PageHeader";
import { getAllCamera } from "../Camera/cameraSlice";
import videoService from "./video.services";

interface Props {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      flexFlow: "column nowrap",
      alignItems: "strech",
    },
    content: {
      display: "flex",
      width: "100%",
      padding: theme.spacing(4),
      flexFlow: "column nowrap",
      alignItems: "center",
      overflowX: "auto",
    },
    content2: {
      display: "flex",
      width: "100%",
      padding: theme.spacing(4),
      flexFlow: "row nowrap",
      alignItems: "center",
      justifyContent: "center",
    },
    liveVideo: {
      width: "100%", // Chiếm toàn bộ chiều rộng của phần tử cha
      maxWidth: "1280px", // Đảm bảo không quá lớn nếu phần tử cha quá rộng
      height: "auto", // Tự động tính chiều cao để giữ tỷ lệ
      aspectRatio: "16 / 9", // Thêm dòng này để cố định tỷ lệ 16:9 cho khung hình (hiện đại hơn width/height)
                           // Đảm bảo tỷ lệ này khớp với output của FFmpeg ở backend
      objectFit: "contain",
      display: "block",
    },
    select: {
      width: "50%",
    },
  })
);
const RealtimeVideo = (props: Props) => {
  const classes = useStyles();
  const cameras = useAppSelector((state) => state.camera.data);
  const refSocket = React.useRef<any>();
  const dispatch = useAppDispatch();

  const [src, setSrc] = React.useState<any>();
  const [camId, setcamId] = React.useState<any>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (refSocket.current) {
        refSocket.current.removeAllListeners();
        refSocket.current.disconnect(); // Đảm bảo disconnect khi component unmount
      }
      if (animationFrameRef.current) { // Hủy animation frame khi component bị hủy
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    dispatch(getAllCamera());
  }, [dispatch]);
  return (
    <div className={classes.root}>
      <PageHeader
        icon={<IconImage icon="LiveTV" width={80} height={80} />}
        title="Luồng phát trực tiếp"
      ></PageHeader>
      <Paper className={classes.content2}>
        <label style={{ marginRight: "2rem", fontWeight: "bold" }}>
          Chọn Camera:
        </label>
        <Select
          className={classes.select}
          id="demo-simple-select"
          onChange={(e) => {
            setcamId(e.target.value);
          }}
        >
          {cameras.map((item: any) => (
            <MenuItem value={item.id}>{item.name}</MenuItem>
          ))}
        </Select>
        <Button
  style={{ marginLeft: "2rem" }}
  color="primary"
  onClick={() => {
    videoService.getStream(camId).then(() => {
      if (refSocket.current) {
        refSocket.current.disconnect();
        refSocket.current.removeAllListeners();
      }
      // Đảm bảo dòng này đang sử dụng biến môi trường:
      const socketUrl = `${process.env.REACT_APP_SOCKET_URL}/cam${camId}`;
          console.log("Attempting to connect Socket.IO to:", socketUrl);
          // KẾT THÚC ĐOẠN CODE THÊM

          refSocket.current = io(socketUrl);

      refSocket.current.on("connect", () => {
        console.log("✅ Socket.IO connected!");
      });
      refSocket.current.on("connect_error", (error: any) => {
        console.error("❌ Socket.IO connection error:", error);
      });
      refSocket.current.on("data", function (data: any) {
        console.log("📡 Received data from server. Data size:", data.length);
        setSrc("data:image/jpeg;base64," + data);
      });
      refSocket.current.on("disconnect", () => {
        console.log("👋 Socket.IO disconnected.");
      });
    });
  }}
>
  Xem
</Button>
      </Paper>
      <Paper className={classes.content}>
      <img
  className={classes.liveVideo}
  id="live-video-div"
  src={src}
  alt=""
></img>
      </Paper>
    </div>
  );
};

export default RealtimeVideo;
