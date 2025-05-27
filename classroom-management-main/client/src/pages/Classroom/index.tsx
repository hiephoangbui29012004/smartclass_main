import { Button, Modal, Paper, Snackbar } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Alert } from "@material-ui/lab";
import React, { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CustomPagination from "../../components/CustomPagination";
import IconImage from "../../components/IconImage";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import PageHeader from "../../components/PageHeader";
import CookieService from "../../services/CookieService";
import {
  closeModal,
  deleteRoom,
  getAllRoom,
  setModalType,
  setSnackbarOpen,
} from "./classroomSlice";
import EditModal from "./components/ClassroomModal";
import CustomToolbar from "./components/CustomToolbar";

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
    gridContainer: { height: "450px", width: "95%" },
  })
);
interface IClassroomProps {}

export default function Classroom(props: IClassroomProps): ReactElement {
  const classes = useStyles();

  const rooms = useAppSelector((state) => state.classroom.data);
  console.log("Rooms data (final):", rooms);
  console.table(rooms);

  const loading = useAppSelector((state) => state.classroom.loading);
  const modalType = useAppSelector((state) => state.classroom.modalType);
  const modalOpen = useAppSelector((state) => state.classroom.modalOpen);
  const snackbarOpen = useAppSelector((state) => state.classroom.snackbarOpen);
  const dispatch = useAppDispatch();

  const [selection, setSelection] = React.useState<any>(null);
  // const [snackbarOpen, setSnackbarOpen] = React.useState(false);
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

  const handleOpen = () => {
    dispatch(setModalType("edit"));
  };

  const handleClose = () => {
    dispatch(closeModal());
  };
  const handleDelete = async () => {
    if (
      window.confirm(
        "Bạn có chắc chắn xóa phòng này? Thao tác này sẽ xóa toàn bộ dữ liệu của phòng này."
      )
    ) {
      await dispatch(deleteRoom(selection.id));
      await dispatch(getAllRoom());
      handleSnackbarOpen();
    }
  };
  React.useEffect(() => {
    dispatch(getAllRoom());
  }, [dispatch]);

  const columns = [
    {
      field: "name",
      headerName: "Tên Phòng",
      flex: 1,
      minWidth: 100,
    },
    { field: "address", headerName: "Địa chỉ", minWidth: 180, flex: 3 },
    { field: "capacity", headerName: "Số lượng tối đa", minWidth: 100, flex: 1, 
        renderCell: (params: any) => { return params.value == null ? "Chưa rõ" : params.value;} },
    ];    
  const role = CookieService.get("role");

  if (role !== "1") return <NotFound />;
  else
    return (
      <div className={classes.root}>
        <PageHeader
          icon={<IconImage icon="ClassroomIcon" width={80} height={80} />}
          title="Danh sách phòng học"
        ></PageHeader>
        <Paper className={classes.content}>
          <div className={classes.gridContainer}>
            <DataGrid
              columns={columns}
              rows={Array.isArray(rooms) ? rooms : []}
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
              <EditModal
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
