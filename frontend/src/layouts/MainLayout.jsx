

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>
          The Logic Lab — Visualize. Learn. Build.
        </p>
      </footer>
    </div>
  );
}

export default MainLayout;
