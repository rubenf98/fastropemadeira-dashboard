import { createHashRouter } from "react-router";
import Template from "./Template";
import Login from "./pages/Login";
import Tracker from "./pages/Tracker";
import Transaction from "./pages/Transaction";
import Transactions from "./pages/Transactions";
import TotalBalanceForm from "./pages/TotalBalanceForm";
import PartnerBalanceForm from "./pages/PartnerBalanceForm";
import Partner from "./pages/Partner";

export const router = createHashRouter([
  {
    element: <Template />,
    children: [
      {
        path: "/dashboard",
        element: <Tracker />,
      },
      {
        path: "/tracker",
        element: <Tracker />,
      },
      {
        path: "/tracker/total-balance",
        element: <TotalBalanceForm />,
      },
      {
        path: "/tracker/partner-balance",
        element: <PartnerBalanceForm />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/transaction/:id",
        element: <Transaction />,
      },
      {
        path: "/partner/:id",
        element: <Partner />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
]);
