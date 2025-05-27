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
import CookieService from "../../../services/CookieService";
import { login } from "../authSlice";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isError = useAppSelector((state) => state.auth.isError);
  const loading = useAppSelector((state) => state.auth.loading);
  const onSubmit = async (data: any) => {
    try {
      const response = await dispatch(login(data));
      const result = await unwrapResult(response);
      let date = new Date();
      date.setTime(date.getTime() + result.expiresIn * 1000);
      const options = { path: "/", expires: date };
      CookieService.set("token", result.access_token, options);
      CookieService.set("role", result.role, options);
      CookieService.set("fullname", result.fullname, options);
      history.push("/");
    } catch (err) {
      console.error(err);
    }
  };

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
          Smart Class - HUST
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tài khoản"
            autoComplete="username"
            autoFocus
            {...register("username", { required: true })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password", { required: true })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Đăng nhập
          </Button>

          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Chưa có tải khoản? Đăng ký ngay."}
              </Link>
            </Grid>
          </Grid>
          {isError && (
            <Alert severity="error" style={{ marginTop: "1rem" }}>
              Tài khoản hoặc mật khẩu chưa chính xác!
            </Alert>
          )}
          <Loading open={loading === "pending"} />
        </form>
      </div>
    </Container>
  );
}
