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
      width: "640px",
      height: "320px",
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

  React.useEffect(() => {
    return () => {
      if (refSocket?.current) refSocket.current.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              refSocket.current = io(location.origin + `/cam${camId}`);
              refSocket.current.on("data", function (data: any) {
                console.log("📡 Received data from server:", data);
                setSrc("data:image/jpeg;base64," + data);
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
          width={640}
          height={320}
        ></img>
      </Paper>
    </div>
  );
};

export default RealtimeVideo;