import { createStyles, makeStyles } from "@material-ui/styles";
import React from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Cell } from "recharts";
interface Props {
  dataSource: any;
}
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexFlow: "column nowrap",
      justifyContent: "center",
      alignItems: "center",
    },
    tableLabel: {
      margin: "1rem",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    tooltipRoot: {
      border: "1px solid #f5f5f5",
      borderRadius: "5px",
      padding: "0.5rem",
      backgroundColor: "hsla(0,0%,100%,.8)",
    },
  })
);
const StatisticsChart = ({ dataSource }: Props) => {
  const classes = useStyles();
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];
  const CustomTooltip = ({ payload, label, active }: any) => {
    if (active) {
      return (
        <div className={classes.tooltipRoot}>
          <h3>{`${label} `}</h3>
          <p>{`Số lượng : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  
  return (
    <div className={classes.root}>
      <div className={classes.tableLabel}>Biểu đồ thống kê</div>
      <BarChart width={1000} height={400} data={dataSource} barSize={80}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        {/* <Legend /> */}
        <Tooltip content={<CustomTooltip />} />
        

        <Bar dataKey="numberOfAction" fill="#8884d8">
          {dataSource.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default StatisticsChart;
