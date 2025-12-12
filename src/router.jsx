import { createBrowserRouter } from "react-router";
import App from "./App";
import Template from "./Template";
import Login from "./pages/Login";
import Tracker from "./pages/Tracker";
import AddTracker from "./pages/AddTracker";
import Transaction from "./pages/Transaction";
import Transactions from "./pages/Transactions";

export const router = createBrowserRouter([
  {
    element: <Template />,
    children: [
      {
        path: "/dashboard",
        element: <App />,
      },
      {
        path: "/tracker",
        element: <Tracker />,
      },
      {
        path: "/tracker/:type",
        element: <AddTracker />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/transaction/:id",
        element: <Transaction />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
]);
