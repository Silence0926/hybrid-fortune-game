import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(
      new URL("../public/sw.js", import.meta.url),
      { scope: import.meta.env.BASE_URL }
    );
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
