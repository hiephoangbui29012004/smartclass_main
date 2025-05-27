import { Card, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fdfdff",
  },
  pageHeader: {
    padding: theme.spacing(4, 4, 1, 4),
    display: "flex",
    marginBottom: theme.spacing(2),
    alignItems: "center",
  },
  pageIcon: {
    display: "inline-block",
    padding: theme.spacing(2),
    color: "#3c44b1",
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    "& .MuiTypography-subtitle2": {
      opacity: "0.6",
    },
  },
}));
interface IPageHeaderProps {
  title: string;
  icon: ReactElement;
}

export default function PageHeader(props: IPageHeaderProps) {
  const classes = useStyles();
  const { title, icon } = props;
  return (
    <Paper elevation={0} square className={classes.root}>
      <div className={classes.pageHeader}>
        <Card className={classes.pageIcon}>{icon}</Card>
        <div className={classes.pageTitle}>
          <Typography
            variant="h5"
            component="div"
            color="primary"
            style={{ fontWeight: "bolder" }}
          >
            {title}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
