import React from "react";
import ReactDOM from "react-dom";
import "./theme/index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);