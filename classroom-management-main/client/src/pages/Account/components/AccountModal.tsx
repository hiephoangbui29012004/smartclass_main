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
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "../../../app/hooks";
import {
  addAccount,
  getAllAccount,
  resetPassword,
  setSnackbarOpen,
  updateAccount,
} from "../accountSlice";

interface IAccountModalProps {
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
    btnResetpass: {
      margin: "1rem",
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
type AccountInputs = {
  username: string;
  password: string;
  fullname: string;
  role: number;
  description: string;
};
const AccountModal = ({ type, data, handleClose }: IAccountModalProps) => {
  const classes = useStyles();
  const defaultValues = {
    username: type === "edit" ? data.username : undefined,
    password: type === "edit" ? data.password : undefined,
    fullname: type === "edit" ? data.fullname : undefined,
    role: type === "edit" ? data.role : undefined,
    description: type === "edit" ? data.description : undefined,
  };
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AccountInputs>({
    defaultValues,
  });
  const onResetPasswordClick = async () => {
    if (window.confirm("Mật khẩu sẽ được tạo tự động. Bạn chắc chứ?")) {
      const result = await dispatch(resetPassword(data.id));
      const response = await unwrapResult(result);
      const newPassword = response.data?.newPassword;
      await dispatch(setSnackbarOpen(true));
      // await navigator.clipboard.writeText(newPassword);
      window.alert(`Mật khẩu mới của bạn là: ${newPassword}.`);
    }
  };
  React.useEffect(() => {
    dispatch(getAllAccount());
  }, [dispatch]);
  const onSubmit = async (dataSubmit: any) => {
    if (type === "edit") {
      if (window.confirm("Bạn chắc chứ?")) {
        await dispatch(updateAccount({ id: data.id, data: dataSubmit }));
        await dispatch(getAllAccount());
        await dispatch(setSnackbarOpen(true));
        handleClose();
      }
    } else {
      await dispatch(addAccount(dataSubmit));
      await dispatch(getAllAccount());
      await dispatch(setSnackbarOpen(true));
      handleClose();
    }
  };

  return (
    <div className={classes.root}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Paper className={classes.header}>
          <Typography variant="h5" className={classes.label} color="primary">
            {type === "edit"
              ? "Chỉnh sửa thông tin tài khoản"
              : "Thêm mới tài khoản"}
          </Typography>
        </Paper>
        <Paper className={classes.content}>
          <Controller
            rules={{ required: "true" }}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.username !== undefined}
                label="Tài khoản"
                className={classes.input}
                helperText={
                  errors.username ? "Bạn chưa điền trường này" : undefined
                }
                variant="outlined"
                margin="normal"
              />
            )}
            name="username"
            control={control}
           />
           {type === "add" && (
             <Controller
               rules={{ required: "true" }}
               render={({ field }) => (
                 <TextField
                   {...field}
                   error={errors.password !== undefined}
                   helperText={
                     errors.password ? "Bạn chưa điền trường này" : undefined
                   }
                   type="password"
                   variant="outlined"
                   label="Mật khẩu"
                   className={classes.input}
                   margin="normal"
                 />
               )}
               name="password"
               control={control}
             />
           )}
           <Controller
             rules={{ required: "true" }}
             render={({ field }) => (
               <TextField
                 {...field}
                 error={errors.fullname !== undefined}
                 helperText={
                   errors.fullname ? "Bạn chưa điền trường này" : undefined
                 }
                 variant="outlined"
                 label="Tên đầy đủ"
                 className={classes.input}
                 margin="normal"
               />
             )}
             name="fullname"
             control={control}
           />

           <FormControl variant="outlined" className={classes.select}>
             <InputLabel id="demo-simple-select-outlined-label">
               Chức vụ
             </InputLabel>
             <Select
               labelId="demo-simple-select-outlined-label"
               id="demo-simple-select-outlined"
               label="Chức vụ"
               defaultValue={type === "edit" ? data.role : 0}
               {...register("role", { required: "true" })}
             >
               <MenuItem value={0}>Người dùng</MenuItem>
               <MenuItem value={1}>Người quản trị</MenuItem>
             </Select>
           </FormControl>
           <Controller
             render={({ field }) => (
               <TextField
                 {...field}
                 multiline
                 rows={4}
                 variant="outlined"
                 label="Chi tiết"
                 className={classes.input}
                 margin="normal"
               />
             )}
             name="description"
             control={control}
           />
           {type === "edit" && (
             <Button
               color="primary"
               variant="outlined"
               className={classes.btnResetpass}
               onClick={onResetPasswordClick}
             >
               Đặt lại mật khẩu
             </Button>
           )}
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

export default AccountModal;
