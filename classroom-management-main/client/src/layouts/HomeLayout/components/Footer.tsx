import {
  createStyles,
  Divider,
  IconButton,
  makeStyles,
  Paper,
} from "@material-ui/core";
import React from "react";
import { Theme } from "react-toastify";
import IconImage from "../../../components/IconImage";

type Props = {};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#96baff",
      flexFlow: "row nowrap",
      display: "flex",
      padding: "2rem",
      gap: "30%",
    },
    info: {
      flexFlow: "column nowrap",
      display: "flex",
      flex: 8,
      alignItems: "start",
      fontSize: "12px",
      color: "white",
    },
    logo: { flex: 1 },
  })
);
const Footer = (props: Props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div className={classes.info}>
        <IconButton>
          <IconImage icon="Logo" width={20} height={20} />
          <div
            className={` character-style-1 `}
            style={{ marginLeft: "1rem", color: "#7c83fd", fontSize: "20px" }}
          >
            Smart Class
          </div>
        </IconButton>
        <Divider />
        <div>
          Hệ thống được phát triển trong khuôn khổ đề tài Khoa học và Công nghệ
          cấp Bộ, Bộ Giáo dục và Đào tạo “Nghiên cứu phát triển hệ thống tự động
          đánh giá hoạt động học tập trong lớp học dựa trên công nghệ xử lý ảnh
          và trí tuệ nhân tạo”
        </div>
        <div>Mã số: CT2020.02.BKA.02</div>
      </div>
      <IconImage
        icon="LogoHust"
        width={80}
        height={110}
        className={classes.logo}
      />
    </Paper>
  );
};

export default Footer;
