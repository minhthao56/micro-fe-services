import Chart from "react-apexcharts";
import useChart from "../hooks/useChart";

export const Steam = () => {
  const {options, state} = useChart();
  return <Chart options={options} series={state} type="area" height={425} />;
};
