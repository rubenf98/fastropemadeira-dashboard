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

// const data = {
//   labels,
//   datasets: [
//     {
//       type: "line",
//       label: "Dataset 1",
//       borderColor: "rgb(255, 99, 132)",
//       borderWidth: 2,
//       fill: false,
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//     },
//     {
//       type: "bar",
//       label: "Dataset 2",
//       backgroundColor: "rgb(75, 192, 192)",
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       borderColor: "white",
//       borderWidth: 2,
//     },
//     {
//       type: "bar",
//       label: "Dataset 3",
//       backgroundColor: "rgb(53, 162, 235)",
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//     },
//   ],
// };

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
      },
      {
        type: "bar",
        label: "Parceiros",
        data: totalPartners,
        backgroundColor: "rgb(215, 59, 11)",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "GetYourGuide",
        data: totalGetYourGuide,
        backgroundColor: "rgb(30, 165, 84)",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Clientes",
        data: nClients,
        backgroundColor: "rgb(0, 0, 0)",
      },
      {
        type: "line",
        label: "Clientes Parceiros",
        data: nClientsPartners,
        backgroundColor: "rgb(113, 113, 113)",
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
