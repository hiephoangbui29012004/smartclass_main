/* eslint-disable */
import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import React from "react";
import IconImage from "../../components/IconImage";
import PageHeader from "../../components/PageHeader";
import CookieService from "../../services/CookieService";

export interface IHomeProps {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      height: "90%",
      flexFlow: "column nowrap",
      alignItems: "strech",
    },
    content: {
      display: "flex",
      width: "100%",
      padding: theme.spacing(4),
      flexFlow: "column nowrap",
      alignItems: "start",
      flex: "1",
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
      width: "1000px",
      height: "800px",
    },
    select: {
      width: "50%",
    },
    info: {
      fontSize: "20px",
    },
  })
);
export default function Home(props: IHomeProps) {
  const classes = useStyles();
  const role = React.useMemo(() => {
    const localRole = CookieService.get("role");
    if (localRole === "1") return "Admin";
    return "Người dùng";
  }, []);
  const fullname = CookieService.get("fullname");
  return (
    <div className={classes.root}>
      <PageHeader
        icon={<IconImage icon="HomeIcon" width={80} height={80} />}
        title="Chào mừng bạn tới với hệ thống quản lý lớp học thông minh!"
      ></PageHeader>

      <Paper className={classes.content}>
        <div className={classes.info}>
          Xin chào {fullname}. Quyền của bạn là {role}!
        </div>
      </Paper>
    </div>
  );
}
