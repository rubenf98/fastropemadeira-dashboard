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

const labels = ["January", "February", "March", "April", "May", "June"];

export const data = {
  labels,
  datasets: [
    {
      label: "Créditos",
      data: labels.map(() => Math.floor(Math.random() * 1001)),
      backgroundColor: "rgba(53, 162, 235)",
      borderRadius: 6,
    },
    {
      label: "Débitos",
      data: labels.map(() => Math.floor(Math.random() * 1001)),
      backgroundColor: "rgb(215, 107, 11)",
      borderRadius: 6,
    },
  ],
};

function TrackerGraph() {
  return (
    <div
      style={{
        width: "100%", // full width of parent
        maxWidth: "100%", // prevent max-width from shrinking it
        height: 200, // desired height in px (change as needed)
        position: "relative", // allows absolute fill of canvas
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0, // top:0; right:0; bottom:0; left:0;
        }}
      >
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default TrackerGraph;
