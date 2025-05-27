import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "../../../app/hooks";
import {
  addRoom,
  getAllRoom,
  setSnackbarOpen,
  updateRoom,
} from "../classroomSlice";

interface IEditModalProps {
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
  })
);
type ClassroomInputs = {
  name: string;
  address: string;
  description: string;
};
const EditModal = ({ type, data, handleClose }: IEditModalProps) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const defaultValues = {
    name: type === "edit" ? data.name : undefined,
    address: type === "edit" ? data.address : undefined,
    description: type === "edit" ? data.description : undefined,
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClassroomInputs>({
    defaultValues,
  });

  const onSubmit = async (dataSubmit: any) => {
    if (type === "edit") {
      if (window.confirm("Bạn chắc chứ?")) {
        await dispatch(updateRoom({ id: data.id, data: dataSubmit }));
        await dispatch(getAllRoom());
        dispatch(setSnackbarOpen(true));
        handleClose();
      }
    } else {
      console.log(dataSubmit);
      await dispatch(addRoom(dataSubmit));
      await dispatch(getAllRoom());
      dispatch(setSnackbarOpen(true));
      handleClose();
    }
  };

  return (
    <div className={classes.root}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Paper className={classes.header}>
          <Typography variant="h5" className={classes.label} color="primary">
            {type === "edit"
              ? "Chỉnh sửa thông tin phòng học"
              : "Thêm mới phòng học"}
          </Typography>
        </Paper>
        <Paper className={classes.content}>
          <Controller
            rules={{ required: "true" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.name !== undefined}
                label="Tên phòng"
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
                error={errors.address !== undefined}
                label="Địa chỉ"
                className={classes.input}
                helperText={
                  errors.address ? "Bạn chưa điền trường này" : undefined
                }
                variant="outlined"
                margin="normal"
              />
            )}
            name="address"
            control={control}
          />
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Mô tả"
                className={classes.input}
                variant="outlined"
                margin="normal"
              />
            )}
            name="description"
            control={control}
          />
        </Paper>
        <div className={classes.footer}>
          <Button
            className={classes.btn}
            variant="contained"
            color="primary"
            type="submit"
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

export default EditModal;
