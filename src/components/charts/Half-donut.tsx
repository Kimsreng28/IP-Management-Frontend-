import React from "react";
import ReactECharts from "echarts-for-react";

interface HalfDoughnutChartProps {
  maleCount: number;
  femaleCount: number;
}

const HalfDoughnutChart: React.FC<HalfDoughnutChartProps> = ({
  maleCount,
  femaleCount,
}) => {
  const total = maleCount + femaleCount;
//   const malePercent =
//     total === 0 ? 0 : Math.round((maleCount / total) * 100);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}",
    },

    // 🔹 Center percentage text
    graphic: {
        type: "text",
        left: "center",
        top: "58%",
        style: {
            text: `Total\n${total}`,
            fontSize: 18,
            fontWeight: "bold",
            lineHeight: 24,
            fill: "#111827",
            textAlign: "center",
        },
    },


    series: [
      {
        type: "pie",
        radius: ["55%", "80%"],
        center: ["50%", "75%"],
        startAngle: 180,

        emphasis: {
          disabled: true,
        },

        label: { show: false },

        data: [
          {
            value: maleCount,
            name: "Male",
            itemStyle: { color: "#3b82f6" }, // blue
          },
          {
            value: femaleCount,
            name: "Female",
            itemStyle: { color: "#ec4899" }, // pink
          },

          // invisible bottom half
          {
            value: total,
            name: "hidden",
            itemStyle: { color: "transparent" },
            tooltip: { show: false },
          },
        ],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export default HalfDoughnutChart;
