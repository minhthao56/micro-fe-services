import { Props } from "react-apexcharts";
import { commonColors } from "@nextui-org/theme";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const textColor = commonColors.zinc["500"];

export default function useChart() {
  const { theme } = useTheme();

  const state: Props["series"] = [
    {
      name: "Booking",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "New Customer",
      data: [11, 32, 45, 32, 34, 52, 41],
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
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
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
      },
      yaxis: {
        labels: {
          style: {
            colors: textColor,
            fontFamily: "Inter, sans-serif",
          },
        },
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
