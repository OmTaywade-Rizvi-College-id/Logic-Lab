
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element "#root" was not found in index.html.');
}

if (!clientId) {
  throw new Error(
    "VITE_GOOGLE_CLIENT_ID is missing. Configure it in your frontend environment."
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
