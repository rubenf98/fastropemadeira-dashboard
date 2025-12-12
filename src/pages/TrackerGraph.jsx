import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: {
        color: "#484848",
      },
    },
    y: {
      grid: { display: true, drawBorder: false },
      ticks: {
        display: true,
        maxTicksLimit: 4,
        padding: 10,
        color: "#484848",
        font: {
          size: 12,
        },
      },
    },
  },
};

function TrackerGraph(props) {
  const apiData = props.data || [];

  // Convert months like 2025-01 → "Jan", "Feb", etc. (optional)
  const formatMonth = (yyyymm) => {
    const [year, month] = yyyymm.split("-");
    return new Date(year, month - 1).toLocaleString("pt-PT", {
      month: "short",
    });
  };

  // Extract labels and datasets from API
  const labels = apiData.map((item) => formatMonth(item.month));

  const incomeData = apiData.map((item) =>
    Math.abs(parseFloat(item.total_income))
  );
  const expenseData = apiData.map((item) =>
    Math.abs(parseFloat(item.total_expense))
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Créditos",
        data: incomeData,
        backgroundColor: "rgba(53, 162, 235)",
        borderRadius: 6,
      },
      {
        label: "Débitos",
        data: expenseData,
        backgroundColor: "rgb(215, 107, 11)",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        height: 200,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default TrackerGraph;
