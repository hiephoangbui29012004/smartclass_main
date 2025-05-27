import { Button, Modal, Paper, Snackbar } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, GridCellParams } from "@material-ui/data-grid";
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
  deleteAction,
  getAllAction,
  setModalType,
  setSnackbarOpen,
} from "./actionSlice";
import EditModal from "./components/AcctionModal";
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

  const actions = useAppSelector((state) => state.action.data);

  const loading = useAppSelector((state) => state.action.loading);
  const modalType = useAppSelector((state) => state.action.modalType);
  const modalOpen = useAppSelector((state) => state.action.modalOpen);
  const snackbarOpen = useAppSelector((state) => state.action.snackbarOpen);
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
        "Bạn có chắc chắn xóa hoạt động này? Thao tác này sẽ xóa toàn bộ dữ liệu của hoạt động này."
      )
    ) {
      await dispatch(deleteAction(selection.id));
      await dispatch(getAllAction());
      handleSnackbarOpen();
    }
  };
  React.useEffect(() => {
    dispatch(getAllAction());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "ID", minWidth: 100, flex: 1 },
    {
      field: "name",
      headerName: "Tên hoạt động",
      flex: 5,
      minWidth: 200,
    },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 5,
      minWidth: 200,
    },
    {
      field: "example",
      headerName: "Mô tả",
      flex: 5,
      minWidth: 200,
      renderCell: (params: GridCellParams) => {
        console.log(params);
        return (
          <img
            alt="sample"
            src={params.row.sample as string}
            style={{ height: "100%" }}
          />
        );
      },
    },
  ];

  const role = CookieService.get("role");

  if (role !== "1") return <NotFound />;
  else
    return (
      <div className={classes.root}>
        <PageHeader
          icon={<IconImage icon="Action" width={80} height={80} />}
          title="Danh sách hoạt động"
        ></PageHeader>
        <Paper className={classes.content}>
          <div className={classes.gridContainer}>
            <DataGrid
              columns={columns}
              rows={Array.isArray(actions) ? actions : []}
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
                Hoạt động <i>{selection.name}</i> được chọn.
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
              <EditModal
                type={modalType}
                data={selection}
                handleClose={handleClose}
              />
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
