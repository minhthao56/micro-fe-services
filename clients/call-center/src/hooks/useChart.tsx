import { useQuery } from "@tanstack/react-query";
import { Props } from "react-apexcharts";
import { commonColors } from "@nextui-org/theme";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import {getStatistics} from "../services/booking/booking"

const textColor = commonColors.zinc["500"];

export default function useChart() {
  const { theme } = useTheme();

  const { data } = useQuery({
    queryKey: ["getStatistics"],
    queryFn: getStatistics,
  });

  console.log(data);

  const state: Props["series"] = [
    {
      name: "Cancel",
      data: [31, 40, 28, 51, 42, 109, 100, 120, 99, 142, 109, 120, 99],
    },
    {
      name: "Completed",
      data: [11, 32, 45, 32, 34, 52, 41, 42, 109, 100, 120, 99, 142],
    },
  ];

  const options = useMemo(() => {
    const color =
      theme === "dark" ? commonColors.zinc["700"] : commonColors.zinc["300"];

    const options: Props["options"] = {
      chart: {
        type: "area",
        animations: {
          easing: "linear",
          speed: 300,
        },
        sparkline: {
          enabled: false,
        },
        brush: {
          enabled: false,
        },
        id: "basic-bar",
        fontFamily: "Inter, sans-serif",
        foreColor: textColor,
        stacked: true,
        toolbar: {
          show: false,
        },
      },

      xaxis: {
        categories: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 0, 2, 4],
        labels: {
          // show: false,
          style: {
            colors: textColor,
            fontFamily: "Inter, sans-serif",
          },
        },
        axisBorder: {
          color: color,
        },
        axisTicks: {
          color: color,
        },
        title:{
          text: "Hours",
          style: {
            color: textColor,
            fontFamily: "Inter, sans-serif",
          },
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: textColor,
            fontFamily: "Inter, sans-serif",
          },
        },
        title:{
          text: "Numbers",
          style: {
            color: textColor,
            fontFamily: "Inter, sans-serif",
          },
        }
      },
      tooltip: {
        enabled: false,
      },
      grid: {
        show: true,
        borderColor: color,
        strokeDashArray: 0,
        position: "back",
      },
      stroke: {
        curve: "smooth",
        fill: {
          colors: ["red"],
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      markers: false,
    };
    return options;
  }, [theme]);

  return {
    options,
    state,
  };
}
