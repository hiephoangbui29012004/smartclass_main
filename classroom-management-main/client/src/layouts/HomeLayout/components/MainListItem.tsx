import {
  Collapse,
  createStyles,
  List,
  makeStyles,
  Theme,
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import IconImage from "../../../components/IconImage";
import CookieService from "../../../services/CookieService";

export interface IMainListItemProps {}
export const MainListItem = (props: IMainListItemProps) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const role = CookieService.get("role");
  const { url } = useRouteMatch();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <div>
      <ListItem
        button
        selected={selectedIndex === 0}
        onClick={(event) => {
          handleListItemClick(event, 0);
          history.push(url);
        }}
      >
        <ListItemIcon>
          <IconImage icon="HomeIcon" />
        </ListItemIcon>
        <ListItemText primary="Trang chủ" />
      </ListItem>
      <ListItem
        button
        selected={selectedIndex === 1}
        onClick={(event) => {
          handleListItemClick(event, 1);
          history.push(`${url}statistics`);
        }}
      >
        <ListItemIcon>
          <IconImage icon="Statistics" />
        </ListItemIcon>
        <ListItemText primary="Thống kê" />
      </ListItem>
      <ListItem
        button
        selected={selectedIndex === 2}
        onClick={(event) => {
          handleListItemClick(event, 2);
          history.push(`${url}realtime-video`);
        }}
      >
        <ListItemIcon>
          <IconImage icon="LiveTV" />
        </ListItemIcon>
        <ListItemText primary="Luồng trực tiếp" />
      </ListItem>
      {role === "1" && (
        <>
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <IconImage icon="AdminIcon" />
            </ListItemIcon>
            <ListItemText primary="Quản lý" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                selected={selectedIndex === 3}
                className={classes.nested}
                onClick={(event) => {
                  handleListItemClick(event, 3);
                  history.push(`${url}admin/classroom`);
                }}
              >
                <ListItemIcon>
                  <IconImage icon="ClassroomIcon" />
                </ListItemIcon>
                <ListItemText primary="Phòng học" />
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem
                button
                selected={selectedIndex === 4}
                className={classes.nested}
                onClick={(event) => {
                  handleListItemClick(event, 4);
                  history.push(`${url}admin/camera`);
                }}
              >
                <ListItemIcon>
                  <IconImage icon="CameraIcon" />
                </ListItemIcon>
                <ListItemText primary="Camera" />
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem
                button
                selected={selectedIndex === 5}
                className={classes.nested}
                onClick={(event) => {
                  handleListItemClick(event, 5);
                  history.push(`${url}admin/action`);
                }}
              >
                <ListItemIcon>
                  <IconImage icon="Action" />
                </ListItemIcon>
                <ListItemText primary="Hoạt động" />
              </ListItem>
            </List>
            <List component="div" disablePadding>
              <ListItem
                button
                selected={selectedIndex === 6}
                className={classes.nested}
                onClick={(event) => {
                  handleListItemClick(event, 6);
                  history.push(`${url}admin/account`);
                }}
              >
                <ListItemIcon>
                  <IconImage icon="AccountIcon" />
                </ListItemIcon>
                <ListItemText primary="Tài khoản" />
              </ListItem>
            </List>
          </Collapse>
        </>
      )}
    </div>
  );
};

export default MainListItem;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);
