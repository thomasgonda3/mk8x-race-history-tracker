import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "dotenv/config";
import "./index.css";
import App from "./app";
import { CookiesProvider } from "react-cookie";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CookiesProvider defaultSetCookies={{ path: "/" }}>
      <App />
    </CookiesProvider>
  </React.StrictMode>
);
