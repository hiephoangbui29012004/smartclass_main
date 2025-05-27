import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addCamera,
  getAllCamera,
  setSnackbarOpen,
  updateCamera,
} from "../cameraSlice";
import { getAllRoom } from "../../Classroom/classroomSlice";
interface ICameraModalProps {
  data?: object | any;
  handleClose: any;
  type: "add" | "edit";
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#f4f5fd",
      border: "2px solid #c6c7cf",
      boxShadow: theme.shadows[5],
      borderRadius: "4px",
      padding: theme.spacing(3, 4, 3),
      display: "flex",
      flexFlow: "column nowrap",
      minWidth: "700px",
    },
    header: {
      backgroundColor: "#fdfdff",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    content: {
      padding: theme.spacing(1),
      display: "flex",
      flexFlow: "column nowrap",
    },
    label: {
      fontWeight: "bolder",
      textAlign: "center",
    },
    input: {
      margin: "1rem",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    btn: {
      margin: "1rem",
      width: "100px",
    },
    lastRow: {
      display: "flex",
      flexFlow: "row noWrap",
    },
    select: {
      flex: "1 1  auto",
      margin: "1rem",
    },
  })
);
type CameraInputs = {
  name: string;
  ipAddress: string;
  spec: string;
  description: string;
  status: number;
  roomID: number;
  streamLink: string;
};
const CameraModal = ({ type, data, handleClose }: ICameraModalProps) => {
  const classes = useStyles();
  const rooms = useAppSelector((state) => state.classroom.data);
  const defaultValues = {
    name: type === "edit" ? data.name : undefined,
    ipAddress: type === "edit" ? data.ipAddress : undefined,
    spec: type === "edit" ? data.spec : undefined,
    description: type === "edit" ? data.description : undefined,
    streamLink: type === "edit" ? data.streamLink : undefined,
    status: type === "edit" ? (data.status ? 1 : 0) : undefined,
    roomID: type === "edit" ? data.room.id : undefined,
  };
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CameraInputs>({
    defaultValues,
  });

  React.useEffect(() => {
    dispatch(getAllRoom());
  }, [dispatch]);
  const onSubmit = async (dataSubmit: any) => {
    if (type === "edit") {
      if (window.confirm("Bạn chắc chứ?")) {
        await dispatch(updateCamera({ id: data.id, data: dataSubmit }));
        await dispatch(getAllCamera());
        await dispatch(setSnackbarOpen(true));
        handleClose();
      }
    } else {
      await dispatch(addCamera(dataSubmit));
      await dispatch(getAllCamera());
      await dispatch(setSnackbarOpen(true));
      handleClose();
    }
  };

  return (
    <div className={classes.root}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Paper className={classes.header}>
          <Typography variant="h5" className={classes.label} color="primary">
            {type === "edit" ? "Chỉnh sửa thông tin camera" : "Thêm mới camera"}
          </Typography>
        </Paper>
        <Paper className={classes.content}>
          <Controller
            rules={{ required: "true" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.name !== undefined}
                label="Tên camera"
                className={classes.input}
                helperText={
                  errors.name ? "Bạn chưa điền trường này" : undefined
                }
                variant="outlined"
                margin="normal"
              />
            )}
            name="name"
            control={control}
          />
          <Controller
            rules={{ required: "true" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.ipAddress !== undefined}
                helperText={
                  errors.ipAddress ? "Bạn chưa điền trường này" : undefined
                }
                variant="outlined"
                label="Địa chỉ IP"
                className={classes.input}
                margin="normal"
              />
            )}
            name="ipAddress"
            control={control}
          />
          <Controller
            rules={{ required: "true" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.spec !== undefined}
                helperText={
                  errors.spec ? "Bạn chưa điền trường này" : undefined
                }
                variant="outlined"
                label="Cấu hình chi tiết"
                className={classes.input}
                margin="normal"
              />
            )}
            name="spec"
            control={control}
          />
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Mô tả"
                className={classes.input}
                margin="normal"
              />
            )}
            name="description"
            control={control}
          />
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Địa chỉ stream"
                className={classes.input}
                margin="normal"
              />
            )}
            name="streamLink"
            control={control}
          />
          <div className={classes.lastRow}>
            <FormControl variant="outlined" className={classes.select}>
              <InputLabel id="demo-simple-select-outlined-label">
                Trạng thái
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="Trạng thái"
                defaultValue={
                  type === "edit" ? (data.status ? 1 : 0) : undefined
                }
                {...register("status", { required: "true" })}
              >
                <MenuItem value={0}>Tắt</MenuItem>
                <MenuItem value={1}>Bật</MenuItem>
              </Select>
            </FormControl>
            {Array.isArray(rooms) && rooms.length > 0 && (
              <FormControl variant="outlined" className={classes.select}>
                <InputLabel id="room-select-label">Thuộc phòng</InputLabel>
                <Select
                  labelId="room-select-label"
                  label="Thuộc phòng"
                  defaultValue={type === "edit" ? data.room?.id : ""}
                  {...register("roomID", { required: true })}
                >
                  {rooms.map((item: any, idx: number) => (
                    <MenuItem key={idx} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        </Paper>
        <div className={classes.footer}>
          <Button
            type="submit"
            className={classes.btn}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
          <Button
            className={classes.btn}
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            Hủy bỏ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CameraModal;
