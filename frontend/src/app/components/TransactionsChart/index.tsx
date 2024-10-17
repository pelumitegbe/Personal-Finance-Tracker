import React from "react";
import ReactECharts from "echarts-for-react";
import { TransactionsListProps } from "../../interface";

const TransactionsChart: React.FC<TransactionsListProps> = ({
  transactions,
}) => {
  // Calculate total amount per category
  const categoryTotals: { [key: string]: number } = {};

  transactions.forEach((transaction) => {
    categoryTotals[transaction.category] =
      (categoryTotals[transaction.category] || 0) + transaction.amount;
  });

  // Prepare the data in the format that ECharts expects
  const chartData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const option = {
    title: {
      text: "Transactions by Category",
      left: "center",
      top: "bottom",
      textStyle: {
        fontSize: 14,
        color: "#4e4e4e",
      },
    },
    legend: {
      left: "left",
      top: "top",
      animation: true,
      orient: "vertical",
      itemWidth: 10,
      itemHeight: 10,
      padding: 2,
      itemGap: 5,
      textStyle: {
        fontSize: 16,
        color: "#4e4e4e",
      },
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "Categories",
        type: "pie",
        radius: ["30%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderWidth: 0,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        color: [
          "#5656ff",
          "#56cfff",
          "#56ffa8",
          "#deff56",
          "#ffc256",
          "#ff5656",
          "#b756ff",
          "#ff56f3",
        ],
        data: chartData,
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height: `500px`,
        width: "100%",
      }}
    />
  );
};

export default TransactionsChart;
