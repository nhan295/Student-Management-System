import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/index.css";

export default function Layout({ onLogout }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className="layout"
      style={{ gridTemplateColumns: isOpen ? "240px 1fr" : "100px 1fr" }}
    >
      <Header
        isOpen={isOpen}
        onToggle={() => setIsOpen((o) => !o)}
        onLogout={onLogout}
      />
      <Sidebar isOpen={isOpen} />
      <main className="main">
        <div className="main-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
