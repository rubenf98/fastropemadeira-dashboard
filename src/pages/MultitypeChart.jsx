import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);

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
      ticks: { color: "#484848" },
    },
    y: {
      type: "linear",
      position: "left",
      grid: { display: true, drawBorder: false },
      ticks: {
        maxTicksLimit: 4,
        padding: 10,
        color: "#484848",
        font: { size: 12 },
        callback: (v) => `${v}€`,
      },
    },
    y1: {
      type: "linear",
      position: "right",
      grid: {
        drawOnChartArea: false, // ⬅️ important (prevents double grid)
      },
      ticks: {
        maxTicksLimit: 4,
        padding: 10,
        color: "#484848",
        font: { size: 12 },
        callback: (v) => Math.round(v),
      },
    },
  },
};

function MultitypeChart(props) {
  const apiData = props.data || [];

  const formatMonth = (yyyymm) => {
    const [year, month] = yyyymm.split("-");
    return new Date(year, month - 1).toLocaleString("pt-PT", {
      month: "short",
    });
  };

  // Extract labels and datasets from API
  const labels = apiData.map((item) => formatMonth(item.month));

  const totalBalance = apiData.map((item) => parseFloat(item.total_balance));
  const totalPartners = apiData.map((item) => parseFloat(item.total_partners));
  const totalGetYourGuide = apiData.map((item) =>
    parseFloat(item.total_getyourguide),
  );
  const nClients = apiData.map((item) => parseFloat(item.n_clients));
  const nClientsPartners = apiData.map((item) =>
    parseFloat(item.n_client_partners),
  );

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Saldo Real",
        data: totalBalance,
        backgroundColor: "rgba(53, 162, 235)",
        borderRadius: 6,
        yAxisID: "y",
        order: 3,
      },
      {
        type: "bar",
        label: "Parceiros",
        data: totalPartners,
        backgroundColor: "rgb(215, 59, 11)",
        borderRadius: 6,
        yAxisID: "y",
        order: 3,
      },
      {
        type: "bar",
        label: "GetYourGuide",
        data: totalGetYourGuide,
        backgroundColor: "rgb(30, 165, 84)",
        borderRadius: 6,
        yAxisID: "y",
        order: 3,
      },
      {
        type: "line",
        label: "Clientes",
        data: nClients,
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(0, 0, 0)",
        yAxisID: "y1",
        tension: 0.3,
        order: 2,
      },
      {
        type: "line",
        label: "Clientes Parceiros",
        data: nClientsPartners,
        borderColor: "rgb(113, 113, 113)",
        backgroundColor: "rgb(113, 113, 113)",
        yAxisID: "y1",
        order: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ height: "300px" }}>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}

export default MultitypeChart;
