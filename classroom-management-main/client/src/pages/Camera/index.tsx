import { Button, Modal, Paper, Snackbar } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, GridCellParams } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import IconImage from "../../components/IconImage";
import NotFound from "../../components/NotFound";
import PageHeader from "../../components/PageHeader";
import CookieService from "../../services/CookieService";
import {
  closeModal,
  deleteCamera,
  getAllCamera,
  setModalType,
  setSnackbarOpen,
} from "./cameraSlice";
import CustomToolbar from "./components/CustomToolbar";
import CameraModal from "./components/CameraModal";
import { Alert } from "@material-ui/lab";
import CustomPagination from "../../components/CustomPagination";
import Loading from "../../components/Loading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      height: "90%",
      flexFlow: "column nowrap",
      alignItems: "strech",
      minWidth: "600px",
    },
    content: {
      display: "flex",
      width: "100%",
      padding: theme.spacing(4),
      flexFlow: "column nowrap",
      alignItems: "center",
    },
    tool: {
      alignItems: "center",
      width: "90%",
      display: "flex",
    },
    selectionName: {
      color: "var(--primary-color)",
      fontWeight: "bold",
    },
    buttonEdit: {
      margin: "1rem",
      marginLeft: "auto",
    },
    buttonDelete: {
      margin: "1rem",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      marginBottom: "2rem",
      color: "var(--primary-color)",
      fontWeight: "bold",
    },
    gridContainer: { height: "450px", width: "95%", minWidth: "500px" },
  })
);
interface ICameraProps {}

export default function Camera(props: ICameraProps): ReactElement {
  const classes = useStyles();
  const cameras = useAppSelector((state) => state.camera.data);
  const loading = useAppSelector((state) => state.camera.loading);
  const modalType = useAppSelector((state) => state.camera.modalType);
  const modalOpen = useAppSelector((state) => state.camera.modalOpen);
  const snackbarOpen = useAppSelector((state) => state.camera.snackbarOpen);
  const camerasData = React.useMemo(() => {
    // Add this console log
    console.log("Value of 'cameras' right before .map:", cameras); 
    
    return (cameras || []).map((item: any) => {
        return { ...item, roomName: item?.room?.name || "N/A" };
    });
}, [cameras]);

  const dispatch = useAppDispatch();

  const [selection, setSelection] = React.useState<any>(null);

  const handleOpen = () => {
    dispatch(setModalType("edit"));
  };

  const handleClose = () => {
    dispatch(closeModal());
  };
  const handleDelete = async () => {
    if (
      window.confirm(
        "Bạn có chắc chắn xóa camera này? Thao tác này sẽ xóa toàn bộ dữ liệu của camera này."
      )
    ) {
      await dispatch(deleteCamera(selection.id));
      await dispatch(getAllCamera());
      handleSnackbarOpen();
    }
  };
  const handleSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbarOpen(false));
  };
  const handleSnackbarOpen = () => {
    dispatch(setSnackbarOpen(true));
  };
  React.useEffect(() => {
    dispatch(getAllCamera());
  }, [dispatch]);

  const columns = [
    { field: "name", headerName: "Tên", flex: 1, minWidth: 100 },
    { field: "ipAddress", headerName: "Địa chỉ IP", minWidth: 120, flex: 1 },
    { field: "spec", headerName: "Cấu hình chi tiết", minWidth: 180, flex: 1 },
    {
      field: "status",
      headerName: "Trạng thái",
      minWidth: 100,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return params.value === 1 ? (
          <IconImage icon="SwitchOn" width={40} height={40} />
        ) : (
          <IconImage icon="SwitchOff" width={40} height={40} />
        );
      },
    },
    { field: "description", headerName: "Mô tả", minWidth: 180, flex: 2 },
    {
      field: "roomName",
      headerName: "Thuộc phòng",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "streamLink",
      headerName: "Địa chỉ kênh stream",
      minWidth: 400,
      flex: 1,
    },
  ];

  const role = CookieService.get("role");

  if (role !== "1") return <NotFound />;
  else
    return (
      <div className={classes.root}>
        <PageHeader
          icon={<IconImage icon="CameraIcon" width={80} height={80} />}
          title="Danh sách camera"
        ></PageHeader>
        <Paper className={classes.content}>
          <div className={classes.gridContainer}>
            <DataGrid
              columns={columns}
              rows={camerasData}
              loading={loading === "pending"}
              components={{
                // NoRowsOverlay: CustomNoRowsOverlay,
                Toolbar: CustomToolbar,
                Pagination: CustomPagination,
              }}
              hideFooterSelectedRowCount
              pagination
              pageSize={50}
              onRowClick={(row) => setSelection(row.row)}
            />
          </div>

          {selection && (
            <div className={classes.tool}>
              <div className={classes.selectionName}>
                <i>{selection.name}</i> được chọn.
              </div>
              <Button
                className={classes.buttonEdit}
                variant="contained"
                color="primary"
                endIcon={<EditIcon />}
                onClick={handleOpen}
              >
                Chỉnh sửa
              </Button>
              <Button
                className={classes.buttonDelete}
                variant="contained"
                color="secondary"
                endIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </div>
          )}
          <Modal
            open={modalOpen}
            onClose={handleClose}
            className={classes.modal}
          >
            <div>
              <CameraModal
                type={modalType}
                data={selection}
                handleClose={handleClose}
              />
            </div>
          </Modal>
        </Paper>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          {loading === "succeeded" ? (
            <Alert onClose={handleSnackbarClose} severity="success">
              Thành công!
            </Alert>
          ) : (
            <Alert onClose={handleSnackbarClose} severity="error">
              Có lỗi xảy ra!
            </Alert>
          )}
        </Snackbar>
        <Loading open={loading === "pending"} />
      </div>
    );
}
