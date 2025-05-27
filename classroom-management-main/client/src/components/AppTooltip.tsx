import { makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import React from "react";

const useStylesBootstrap = makeStyles((theme: Theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const AppTooltip = (props: TooltipProps) => {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
};
export default React.memo(AppTooltip);
