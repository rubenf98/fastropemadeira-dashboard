import { createBrowserRouter } from "react-router";
import App from "./App";
import Template from "./Template";
import Login from "./pages/Login";
import Tracker from "./pages/Tracker";
import AddTracker from "./pages/AddTracker";

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
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
]);
