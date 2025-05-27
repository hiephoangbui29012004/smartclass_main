import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import IconImage from "../../../components/IconImage";
import Loading from "../../../components/Loading";
import { signup } from "../authSlice";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    margin: theme.spacing(1),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isError = useAppSelector((state) => state.auth.isError);
  const onSubmit = async (data: any) => {
    try {
      let account = {
        username: data.username,
        password: data.password,
        fullname: `${data.firstname} ${data.lastname}`,
      };
      const response = await dispatch(signup(account));
      await unwrapResult(response);
      history.push({ pathname: "/", state: { from: history.location } });
    } catch (err) {
      console.log(err);
    }
  };
  const loading = useAppSelector((state) => state.auth.loading);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <IconImage
          icon="Logo"
          className={classes.logo}
          width={100}
          height={100}
        />
        <Typography component="h1" variant="h5" color="primary">
          Smart Class - Đăng ký
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Họ đệm"
                autoFocus
                {...register("firstname", { required: true })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Tên"
                autoComplete="lname"
                {...register("lastname", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Tài khoản"
                autoComplete="username"
                {...register("username", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password", { required: true })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Đăng ký
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                Đã có tài khoản? Đăng nhập.
              </Link>
            </Grid>
          </Grid>
          {isError && (
            <Alert severity="error" style={{ marginTop: "1rem" }}>
              Có lỗi xảy ra !
            </Alert>
          )}
          <Loading open={loading === "pending"} />
        </form>
      </div>
    </Container>
  );
}
