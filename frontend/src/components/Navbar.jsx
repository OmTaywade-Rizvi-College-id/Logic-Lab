
import { NavLink } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Lightbulb } from "lucide-react";
import "./Navbar.css";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Algorithms", path: "/algorithms" },
  { label: "Route Lab", path: "/route-lab" },
  { label: "Applications", path: "/applications" },
  { label: "Code & Complexity", path: "/code-complexity" },
  { label: "Practice", path: "/practice" },
  { label: "About", path: "/about" },
];

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <div className="navbar-brand">
        <Lightbulb size={28} strokeWidth={2} />
        <span>The Logic Lab</span>
        </div>
      </NavLink>

      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <button
          className="icon-button"
          type="button"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <button className="login-button" type="button">
          Login
        </button>

        <button
          className="mobile-menu"
          type="button"
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
