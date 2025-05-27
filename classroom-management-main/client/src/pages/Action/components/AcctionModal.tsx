import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../app/hooks";
import {
  addAction,
  getAllAction,
  setSnackbarOpen,
  updateAction,
} from "../actionSlice";

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
type ActionInputs = {
  name: string;
  description: string;
};
const EditModal = ({ type, data, handleClose }: IEditModalProps) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const defaultValues = {
    name: type === "edit" ? data.name : undefined,
    description: type === "edit" ? data.description : undefined,
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActionInputs>({
    defaultValues,
  });
  const [image, setImage] = React.useState<any>(
    type === "edit" ? data.sample : undefined
  );

  const onSubmit = async (dataSubmit: any) => {
    if (type === "edit") {
      if (window.confirm("Bạn chắc chứ?")) {
        await dispatch(
          updateAction({ id: data.id, data: { ...dataSubmit, sample: image } })
        );
        await dispatch(getAllAction());
        dispatch(setSnackbarOpen(true));
        handleClose();
      }
    } else {
      await dispatch(addAction({ ...dataSubmit, sample: image }));
      await dispatch(getAllAction());
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
              ? "Chỉnh sửa thông tin hoạt động"
              : "Thêm mới hoạt động"}
          </Typography>
        </Paper>
        <Paper className={classes.content}>
          <Controller
            rules={{ required: "true" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.name !== undefined}
                label="Tên hoạt động"
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

          <div
            style={{
              marginLeft: "15px",
              display: "flex",
              flexFlow: "row",
              alignItems: "center",
            }}
          >
            <label
              style={{
                marginRight: "15px",
              }}
            >
              Chọn hình ảnh
            </label>
            <TextField
              type="file"
              onChange={(e: any) => {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                const size = e.target.files[0].size;

                reader.onload = function () {
                  if (size <= 1024 * 1024) setImage(reader.result);
                  else toast.error("Vui lòng chọn file < 1Mb");
                };
              }}
            />
            <img
              alt={"sample"}
              src={image}
              style={{ width: "150px", marginLeft: "15px" }}
            ></img>
          </div>
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
