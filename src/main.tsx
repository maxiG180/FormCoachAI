// index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import App from "./App";
import "./index.css";
import "@tensorflow/tfjs-backend-webgl";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
