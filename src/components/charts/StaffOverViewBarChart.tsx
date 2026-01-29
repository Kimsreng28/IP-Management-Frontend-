import React from "react";
import ReactECharts from "echarts-for-react";

interface Props {
  studentCount: number;
  teacherCount: number;
  hodCount: number;
}

const StaffOverviewBarChart: React.FC<Props> = ({
  studentCount,
  teacherCount,
  hodCount,
}) => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },

    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: ["Students", "Teachers", "HODs"],
      axisTick: { show: false },
    },

    yAxis: {
      type: "value",
      allowDecimals: false,
    },

    series: [
      {
        name: "Total",
        type: "bar",
        barWidth: "45%",
        data: [
          {
            value: studentCount,
            itemStyle: { color: "#3b82f6" }, // blue
          },
          {
            value: teacherCount,
            itemStyle: { color: "#10b981" }, // green
          },
          {
            value: hodCount,
            itemStyle: { color: "#f59e0b" }, // amber
          },
        ],
        label: {
          show: true,
          position: "top",
          fontWeight: 600,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 320 }} />;
};

export default StaffOverviewBarChart;