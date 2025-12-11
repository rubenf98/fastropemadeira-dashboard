import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  loginSuccess,
  me,
  refreshAuthorizationToken,
  setAuthorizationToken,
} from "./redux/redux-modules/auth/actions.js";
import { RouterProvider } from "react-router";
import { router } from "./router.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { jwtDecode } from "jwt-decode";
import { store } from "./redux/store.js";

if (localStorage.token) {
  const token = jwtDecode(localStorage.token);
  const tokenExp = token.exp < Date.now() / 1000;

  if (tokenExp) {
    store.dispatch(refreshAuthorizationToken(localStorage.token));
  } else {
    store.dispatch(loginSuccess());

    setAuthorizationToken(localStorage.token);
    store.dispatch(me());
  }
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
