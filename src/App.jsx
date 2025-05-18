import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"

export  default function  App() {
  return (
        <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard-admin" element={<Dashboard />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
        </Router>
  )
}