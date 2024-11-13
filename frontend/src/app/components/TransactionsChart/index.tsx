import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { TransactionsListProps } from "../../interface";
import { useCategory } from "../../hooks/category";
import { Category } from "../../interface";

const TransactionsChart: React.FC<TransactionsListProps> = ({
  transactions,
}) => {

  //fetch categories
  const categories: Category[] = useCategory();

   // Map categories_id to their names for easy lookup
   const categoryMap = categories.reduce((map, category) => {
    map[category.id] = category.name;
    return map;
  }, {} as { [key: string]: string });

   // Calculate total amount per category
   const categoryTotals = transactions.reduce((totals, transaction) => {
    const categoryName = categoryMap[transaction.categories_id] || "Other";
    const currentTotal = (totals[categoryName] || 0) + parseFloat(transaction.amount);
    totals[categoryName] = parseFloat(currentTotal.toFixed(2));
    return totals;
  }, {} as { [key: string]: number });

  // Prepare the data in the format that ECharts expects
  const chartData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const option = {
    title: {
      text: "Expenses by Category",
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
      orient: "vertical",
      itemWidth: 10,
      itemHeight: 10,
      padding: 2,
      itemGap: 5,
      textStyle: {
        fontSize: 11,
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
        height: `400px`,
        width: "100%",
      }}
    />
  );
};

export default TransactionsChart;
