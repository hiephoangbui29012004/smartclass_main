import { useGridSlotComponentProps } from "@material-ui/data-grid";
import { Pagination } from "@material-ui/lab";

export default function CustomPagination() {
  const { state, apiRef } = useGridSlotComponentProps();
  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
