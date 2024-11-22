import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.scss";
import Dashboard from "./pages/dashboard";

export enum BgColor {
  RED = "#e8583c",
  YELLOW = "#ffdb0a",
  BLUE = "#10c9f2",
  GREY = "#d9d9d9",
  DARKBLUE = "#2775ca",
  GREEN = "#37D647",
}

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}

export default App;
