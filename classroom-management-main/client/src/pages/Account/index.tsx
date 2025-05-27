import { Button, Modal, Paper, Snackbar } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, GridCellParams, GridColumns } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import IconImage from "../../components/IconImage";
import NotFound from "../../components/NotFound";
import PageHeader from "../../components/PageHeader";
import CookieService from "../../services/CookieService";
import CustomPagination from "../../components/CustomPagination";
import CustomToolbar from "./components/CustomToolbar";
import { Alert } from "@material-ui/lab";
import {
  closeModal,
  deleteAccount,
  getAllAccount,
  setModalType,
  setSnackbarOpen,
} from "./accountSlice";
import AccountModal from "./components/AccountModal";
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
    role: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    roleIcon: {
      marginRight: "10px",
    },
  })
);
interface IAccountProps {}

export default function Account(props: IAccountProps): ReactElement {
  const classes = useStyles();
  const accounts = useAppSelector((state) => state.account.data);
  const loading = useAppSelector((state) => state.account.loading);
  const modalType = useAppSelector((state) => state.account.modalType);
  const modalOpen = useAppSelector((state) => state.account.modalOpen);
  const snackbarOpen = useAppSelector((state) => state.account.snackbarOpen);

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
        "Bạn có chắc chắn xóa tài khoản này? Thao tác này sẽ xóa toàn bộ dữ liệu của tài khoản này."
      )
    ) {
      await dispatch(deleteAccount(selection.id));
      await dispatch(getAllAccount());
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
    dispatch(getAllAccount());
  }, [dispatch]);

  const columns = [
    {
      field: "username",
      headerName: "Tên tài khoản",
      flex: 1,
      minWidth: 100,
      //resizable: true,
    },
    {
      field: "fullname",
      headerName: "Tên đầy đủ",
      minWidth: 200,
      flex: 2,
      //resizable: true,
    },
    {
      field: "role",
      headerName: "Chức vụ",
      minWidth: 100,
      flex: 1,
      //resizable: true,
      renderCell: (params: GridCellParams) => {
        return params.value === 1 ? (
          <div className={classes.role}>
            <IconImage className={classes.roleIcon} icon="AdminIcon" />
            Người quản trị
          </div>
        ) : (
          <div className={classes.role}>
            <IconImage className={classes.roleIcon} icon="UserIcon" />
            Người dùng
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: "Mô tả",
      minWidth: 180,
      flex: 2,
      //resizable: true,
    },
  ] as GridColumns;

  const role = CookieService.get("role");

  if (role !== "1") return <NotFound />;
  else
    return (
      <div className={classes.root}>
        <PageHeader
          icon={<IconImage icon="AccountIcon" width={80} height={80} />}
          title="Danh sách tài khoản"
        ></PageHeader>
        <Paper className={classes.content}>
          <div className={classes.gridContainer}>
            <DataGrid
              columns={columns}
              rows={accounts}
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
                Tài khoản <i>{selection.username}</i> được chọn.
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
              <AccountModal
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
