import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  makeStyles,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import clsx from "clsx";
import React from "react";
import IconImage from "../../components/IconImage";
import Footer from "./components/Footer";
import MainListItem from "./components/MainListItem";
import UserMenu from "./components/UserMenu";

type Props = {};
const theme = createTheme({
  palette: {
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    minHeight: "100%",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: "var(--primary-color)",
    borderRadius: "3px",
    zIndex: theme.zIndex.drawer + 1,
    marginLeft: theme.spacing(9),
    width: `calc(100% - 72px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "unset",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,

    overflow: "auto",
    padding: theme.spacing(5),
    display: "flex",
    flexFlow: "column",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  logoLabel: {
    marginLeft: "20px",
    color: "var(--primary-color)",
    fontStyle: "bold",
  },
  logoLabelHidden: {
    display: "none",
  },
}));

const HomeLayout: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
            >
              {" "}
              {open ? <MenuOpenIcon /> : <ListIcon />}
            </IconButton>

            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            ></Typography>
            <UserMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <IconButton>
            <IconImage icon="Logo" width={40} height={40} />
            <div
              className={`${
                open ? classes.logoLabel : classes.logoLabelHidden
              } character-style-1 `}
            >
              Smart Class
            </div>
          </IconButton>
          <Divider />
          <List>
            <MainListItem />
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {children}
          <Footer />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default HomeLayout;
const drawerWidth = 240;
