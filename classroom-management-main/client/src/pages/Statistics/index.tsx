
import {
  Button,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { DateRange, DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import IconImage from "../../components/IconImage";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import { getAllRoom } from "../Classroom/classroomSlice";
import StatisticsChart from "./components/StatisticsChart";
import StatisticsTable from "./components/StatisticsTable";
import {
  drawChart,
  exportExcel,
  getStatistics,
  resetStatistics,
} from "./statisticsSlice";
import VideoPlayer from './components/videoPlayer';
import statisticsService from "./statisticsService";

interface Props {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      height: "90%",
      flexFlow: "column nowrap",
      alignItems: "strech",
      minWidth: "600px",
    },
    content: {
      display: "flex",
      width: "100%",
      padding: theme.spacing(4),
      flexFlow: "column nowrap",
      alignItems: "center",
      flex: "1",
    },
    selectToolbar: {
      width: "100%",
      display: "flex",
      flexFlow: "row nowrap",
      alignItems: "center",
    },
    roomSelect: {
      flex: "1 1 auto",
      marginRight: "20px",
      minWidth: "15rem",
    },
    buttonSubmit: {
      marginLeft: "20px",
    },
    videoButton: {
      marginTop: theme.spacing(2),
    },
  })
);
const Statistics = (props: Props) => {
  const dispatch = useAppDispatch();
  const statisticsData = useAppSelector((state) => state.statistics.data);
  const chartData = useAppSelector((state) => state.statistics.chart);
  const rooms = useAppSelector((state) => state.classroom.data);
  const loading = useAppSelector((state) => state.statistics.loading);
  // component state

  const [rangeDate, setRangeDate] = React.useState<DateRange<Date>>([
    null,
    null,
  ]);
  const [selectedRoom, setSelectedRoom] = React.useState<number | undefined>(0);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [frames, setFrames] = useState<string[]>([]);

  //handle alert

  //submit form
  const _onSubmit = async (e: any) => {
    e.preventDefault();
    await dispatch(
      getStatistics({
        classroomId: selectedRoom,
        dateFrom: rangeDate[0],
        dateTo: rangeDate[1],
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Thành công!");
        dispatch(
          drawChart({
            classroomId: selectedRoom,
            dateFrom: rangeDate[0],
            dateTo: rangeDate[1],
          })
        )
          .unwrap()
          .then(() => toast.success("Vẽ biểu đồ thành công!"));
      });
  };
  //get classroom data
  React.useEffect(() => {
    dispatch(getAllRoom());
    //cleanup
    return () => {
      dispatch(resetStatistics());
    };
  }, [dispatch]);
  const classes = useStyles();
  const formats = {
    keyboardDate: "dd/MM/yyyy",
  };

  const fetchVideos = async () => {
    try {
      const response = await statisticsService.getVideos({
        classroomId: selectedRoom,
        dateFrom: rangeDate[0],
        dateTo: rangeDate[1],
      });
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Không thể lấy danh sách video');
    }
  };

  const fetchVideoFrames = async (videoId: number) => {
    try {
      const response = await statisticsService.getVideoFrames(videoId);
      setFrames(response.data.frames);
    } catch (error) {
      console.error('Error fetching video frames:', error);
      toast.error('Không thể lấy frames của video');
    }
  };

  useEffect(() => {
    if (selectedRoom && rangeDate[0] && rangeDate[1]) {
      fetchVideos();
    }
  }, [selectedRoom, rangeDate]);

  const handleVideoSelect = async (videoId: number) => {
    const video = videos.find(v => v.id === videoId);
    setSelectedVideo(video);
    await fetchVideoFrames(videoId);
  };

  // console.log("Frames truyền vào VideoPlayer:", frames);

  return (
    <div className={classes.root}>
      <PageHeader
        icon={<IconImage icon="Statistics" width={40} height={40} />}
        title="Thống kê theo lớp học"
      ></PageHeader>
      <Paper className={classes.content}>
        <form className={classes.selectToolbar} onSubmit={_onSubmit}>
          <FormControl
            variant="outlined"
            className={classes.roomSelect}
            required
          >
            <InputLabel id="demo-simple-select-label">
            Chọn phòng học
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Select classroom"
              value={selectedRoom ?? ""}
              onChange={(e) => {
                setSelectedRoom(e.target.value as number);
              }}
              
            >
              {rooms.map((item: any, idx: number) => (
                <MenuItem key={idx} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            dateFormats={formats}
          >
            <DateRangePicker
              calendars={1}
              startText="Từ ngày"
              endText="Đến ngày"
              value={rangeDate ?? [null, null]}
              onChange={(newValue) => {
                setRangeDate(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} required />
                  <Box sx={{ mx: 2 }}> đến </Box>
                  <TextField {...endProps} required />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
          <div style={{ display: "flex", alignItems: "center", marginLeft: 24, gap: 16 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ minWidth: 120, fontWeight: 600 }}
            >
              PHÂN TÍCH
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenVideoDialog(true)}
              style={{ minWidth: 120, fontWeight: 600 }}
            >
              XEM VIDEO
            </Button>
          </div>
        </form>
      </Paper>
      <Paper className={classes.content}>
        {statisticsData ? (
          <StatisticsTable
            onExportClick={() => {
              dispatch(
                exportExcel({
                  classroomId: selectedRoom,
                  dateFrom: rangeDate[0],
                  dateTo: rangeDate[1],
                })
              );
            }}
            dataSource={statisticsData}
            loading={loading}
          ></StatisticsTable>
        ) : (
          <h1>Không có dữ liệu thống kê</h1>
        )}
      </Paper>
      <Paper className={classes.content}>
        {chartData ? (
          <StatisticsChart dataSource={chartData}></StatisticsChart>
        ) : (
          <></>
        )}
      </Paper>

      

      <Dialog
        open={openVideoDialog}
        onClose={() => setOpenVideoDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Xem Video</DialogTitle>
        <DialogContent>
          <Select
            value={selectedVideo?.id || ''}
            onChange={(e) => handleVideoSelect(e.target.value as number)}
            fullWidth
            style={{ marginBottom: '1rem' }}
          >
            {videos.map((video) => (
              <MenuItem key={video.id} value={video.id}>
                {new Date(video.start_time).toLocaleString()} - {new Date(video.end_time).toLocaleString()}
              </MenuItem>
            ))}
          </Select>
          
          {console.log("Frames truyền vào VideoPlayer:", frames)}

          {frames.length > 0 && <VideoPlayer frames={frames} />}
        </DialogContent>
      </Dialog>

      <Loading open={loading === "pending"} />
    </div>
  );
};

export default Statistics;
