import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/* 🔥 PERFORMANCE + ROOT INIT */
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/* 🚀 OPTIONAL: FUTURE EXTENSIONS */

// You can later add:
// - Redux Provider
// - Theme Context
// - Error Boundaries
// - Analytics

/*
Example:

import { Provider } from "react-redux";
import store from "./store";

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
*/

/* 💡 HOT RELOAD SUPPORT (DEV) */
if (import.meta.hot) {
  import.meta.hot.accept();
}
