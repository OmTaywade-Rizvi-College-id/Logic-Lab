// src/App.tsx

import { useState } from "react";
import {
  Home as HomeIcon,
  Info,
  Layers,
  Code2,
  Dumbbell,
  Route,
  Menu,
  X,
} from "lucide-react";

import Home from "./pages/Home";
import About from "./pages/About";
import Applications from "./pages/Applications";
import CodeComplexity from "./pages/CodeComplexity";
import Practice from "./pages/Practice";
import RouteLab from "./pages/RouteLab";
import ExploreAlgorithms from "./pages/ExploreAlgorithms";

type PageId =
  | "home"
  | "about"
  | "applications"
  | "complexity"
  | "practice"
  | "route"
  | "algorithms";

const navigation: {
  id: PageId;
  label: string;
  icon: typeof HomeIcon;
}[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "about", label: "About", icon: Info },
  { id: "applications", label: "Applications", icon: Layers },
  { id: "complexity", label: "Complexity", icon: Code2 },
  { id: "practice", label: "Practice", icon: Dumbbell },
  { id: "route", label: "Route Lab", icon: Route },
];

export default function App() {
  const [page, setPage] = useState<PageId>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  function renderPage() {
    switch (page) {
      case "home":
        return <Home />;
      case "about":
        return <About />;
      case "applications":
        return <Applications />;
      case "complexity":
        return <CodeComplexity />;
      case "practice":
        return <Practice />;
      case "route":
        return <RouteLab />;
      case "algorithms":
        return <ExploreAlgorithms />;
      default:
        return <Home />;
    }
  }

  function navigateTo(id: PageId) {
    setPage(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#f5f7f1] text-[#203626]">
      <header className="sticky top-0 z-50 border-b border-[#dce4d6] bg-[#f8faf5]/95 backdrop-blur">
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigateTo("home")}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Go to Home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#203626] text-sm font-bold text-white">
              L
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Logic Lab
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigateTo(id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  page === id
                    ? "bg-[#e5edd9] font-semibold text-[#365b35]"
                    : "text-[#647264] hover:bg-[#edf1e8] hover:text-[#203626]"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => navigateTo("algorithms")}
              className={`ml-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                page === "algorithms"
                  ? "bg-[#365b35] text-white"
                  : "bg-[#203626] text-white hover:bg-[#365b35]"
              }`}
            >
              Algorithm Visualizer
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-[#e9eee3] md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-[#dce4d6] bg-[#f8faf5] p-3 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateTo(id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                    page === id
                      ? "bg-[#e5edd9] font-semibold text-[#365b35]"
                      : "hover:bg-[#edf1e8]"
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => navigateTo("algorithms")}
                className="mt-1 rounded-lg bg-[#203626] px-3 py-2.5 text-left text-sm font-semibold text-white"
              >
                Algorithm Visualizer
              </button>
            </div>
          </div>
        )}
      </header>

      <main>{renderPage()}</main>
    </div>
  );
}