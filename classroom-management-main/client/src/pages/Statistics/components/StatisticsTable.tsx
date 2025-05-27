import { Button, createStyles, Theme } from "@material-ui/core";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
} from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/styles";
import React from "react";
// import { toast } from "react-toastify";
// import { useAppDispatch } from "../../../app/hooks";
// import { downloadImage } from "../statisticsSlice";

interface Props {
  dataSource: any;
  loading: any;
  onExportClick?: () => void;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainer: { height: "300px", width: "95%" },
    exportField: {
      marginTop: "1rem",
      display: "flex",
      justifyContent: "flex-end",
    },
  })
);

const formatDate = (value: any) => {
  if (!value) return "Không xác định";
  const date = new Date(value);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
const StatisticsTable = ({ dataSource, loading, onExportClick }: Props) => {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);

  // const handleClose = () => setOpen(false);
  // const [imgSrc, setimgSrc] = React.useState("");
  const classes = useStyles();
  // const dispatch = useAppDispatch();
  const rows: GridRowsProp = React.useMemo(() => {
    return dataSource.map((data: any, idx: number) => ({
      id: data.id,
      activity_name: data.activity?.name || "Không xác định",
      start_time: data.start_time,
      end_time: data.end_time,
    }));
  }, [dataSource]);
  // const showImage = React.useCallback(
  //   (param) => {
  //     dispatch(downloadImage(param.value))
  //       .unwrap()
  //       .then((response) => {
  //         setimgSrc(URL.createObjectURL(response.data));
  //         handleOpen();
  //       })
  //       .catch(() => {
  //         toast.error("Không thể tải ảnh");
  //       });
  //     //call api get image
  //     console.log(
  //       "%cStatisticsTable.tsx line:33 param",
  //       "color: #007acc;",
  //       param
  //     );
  //   },
  //   [dispatch]
  // );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID instance",
      flex: 2,
      minWidth: 100,
    },
    {
      field: "activity_name",
      headerName: "Hoạt động",
      flex: 2,
      minWidth: 150,
    },
    {
      field: "start_time",
      headerName: "Bắt đầu",
      flex: 2,
      minWidth: 150,
      renderCell: (params) => <>{formatDate(params.value)}</>,
    },
    {
      field: "end_time",
      headerName: "Kết thúc",
      flex: 2,
      minWidth: 150,
      renderCell: (params) => <>{formatDate(params.value)}</>,
    },
  ];
  return (
    <div className={classes.gridContainer}>
      <DataGrid
        columns={columns}
        rows={rows}
        loading={loading === "pending"}
        pagination
        pageSize={50}
      />
      <div className={classes.exportField}>
        {dataSource.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={() => onExportClick?.()}
          >
            Xuất file excel
          </Button>
        )}
      </div>
      
    </div>
  );
};

export default StatisticsTable;