import {
  Button,
  createStyles,
  Dialog,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React from "react";
import CookieService from "../../../services/CookieService";
import passwordService from "../../password.services";
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
      minWidth: "600px",
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
export default function UserMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>({
    pass: null,
    newpass1: null,
    newpass2: null,
  });
  const [pass, setPass] = React.useState<any>("");
  const [newpass1, setnewPass1] = React.useState<any>("");
  const [newpass2, setnewPass2] = React.useState<any>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePass = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    CookieService.remove("token");
    CookieService.remove("role");

    setAnchorEl(null);
    window.location.href = "/";
  };

  const handleChange = () => {
    let valid = true;

    for (let item of Object.values(error)) {
      if (item !== null) valid = false;
      break;
    }
    if (valid) {
      passwordService
        .changePass({
          pass,
          newpass1,
          newpass2,
        })
        .then(() => setOpen(false))
        .catch((err) => {
          setError((prev: any) => ({ ...prev, pass: "Sai mật khẩu!" }));
        });
    }
  };

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleChangePass}>Đổi mật khẩu</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
      <Dialog open={open} onClose={handleCloseModal}>
        <div className={classes.root}>
          <Paper className={classes.header}>
            <Typography variant="h5" className={classes.label} color="primary">
              Đổi mật khẩu
            </Typography>
          </Paper>
          <Paper className={classes.content}>
            <TextField
              error={Boolean(error.pass)}
              label="Mật khẩu cũ"
              className={classes.input}
              helperText={error.pass ? error.pass : undefined}
              variant="outlined"
              margin="normal"
              type="password"
              onChange={(e) => {
                const value = e.target.value;
                if (value === null || value === undefined || value === "") {
                  setError((prev: any) => ({
                    ...prev,
                    pass: "Vui lòng nhập trường này!",
                  }));
                } else {
                  setError((prev: any) => ({
                    ...prev,
                    pass: null,
                  }));
                }
                setPass(value);
              }}
            />
            <TextField
              error={Boolean(error.newpass1)}
              label="Mật khẩu mới"
              className={classes.input}
              helperText={error.newpass1 ? error.newpass1 : undefined}
              variant="outlined"
              margin="normal"
              type="password"
              onChange={(e) => {
                const value = e.target.value;
                if (value === null || value === undefined || value === "") {
                  setError((prev: any) => ({
                    ...prev,
                    newpass1: "Vui lòng nhập trường này!",
                  }));
                } else {
                  setError((prev: any) => ({
                    ...prev,
                    newpass1: null,
                  }));
                }
                setnewPass1(value);
              }}
            />
            <TextField
              error={Boolean(error.newpass2)}
              label="Nhập lại"
              className={classes.input}
              helperText={error.newpass2 ? error.newpass2 : undefined}
              variant="outlined"
              margin="normal"
              type="password"
              onChange={(e) => {
                const value = e.target.value;
                if (value === null || value === undefined || value === "") {
                  setError((prev: any) => ({
                    ...prev,
                    newpass2: "Vui lòng nhập trường này!",
                  }));
                } else {
                  setError((prev: any) => ({
                    ...prev,
                    newpass2: null,
                  }));
                }
                setnewPass2(value);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== newpass1) {
                  setError((prev: any) => ({
                    ...prev,
                    newpass2: "Mật khẩu nhập lại không chính xác!",
                  }));
                } else {
                  setError((prev: any) => ({
                    ...prev,
                    newpass2: null,
                  }));
                }
              }}
            />
          </Paper>
          <div className={classes.footer}>
            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              onClick={handleChange}
            >
              OK
            </Button>
            <Button
              className={classes.btn}
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
