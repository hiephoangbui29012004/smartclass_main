import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import * as React from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../app/hooks";
import cameraService from "../cameraService";
import { getAllCamera, importCamera, setModalType } from "../cameraSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      flexFlow: "row wrap",
      alignItems: "start",
    },

    button: {
      marginRight: theme.spacing(1),
      width: "120px",
    },
    buttonImport: {
      marginLeft: "auto",
    },
  })
);
export default function CustomToolbar() {
  const classes = useStyles();
  const uploadRef = React.useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setModalType("add"));
  };
  const handleImport = (e: any) => {
    dispatch(importCamera(e.target.files[0]))
      .unwrap()
      .then(() => {
        toast.success("Nhập dữ liệu thành công");
        dispatch(getAllCamera());
      })
      .catch(() => toast.error("Không thể import file. Vui lòng kiểm tra lại"));
  };
  return (
    <GridToolbarContainer className={classes.root}>
      <Button
        color="primary"
        className={classes.button}
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleClick}
      >
        Thêm mới
      </Button>
      <GridToolbarFilterButton className={classes.button} />
      <GridToolbarDensitySelector className={classes.button} />
      <Button
        color="primary"
        className={classes.buttonImport}
        startIcon={<ImportExportIcon />}
        onClick={() => uploadRef.current?.click()}
      >
        Nhập dữ liệu từ file Excel
        <input
          type="file"
          ref={uploadRef}
          hidden
          onChange={handleImport}
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </Button>
      <Button
        color="primary"
        className={classes.buttonImport}
        startIcon={<ImportExportIcon />}
        onClick={() => cameraService.exportCamera()}
      >
        Xuất dữ liệu ra file excel
      </Button>
    </GridToolbarContainer>
  );
}
