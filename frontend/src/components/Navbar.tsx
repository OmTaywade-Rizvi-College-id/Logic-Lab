
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Lightbulb, ArrowUpRight } from "lucide-react";
import gsap from "gsap";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Algorithms", path: "/algorithms" },
  { label: "Route Lab", path: "/route-lab" },
  { label: "Applications", path: "/applications" },
  { label: "Code & Complexity", path: "/code-complexity" },
  { label: "Practice", path: "/practice" },
  { label: "About", path: "/about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }, header);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const nav = mobileNavRef.current;

    if (!nav || window.innerWidth >= 1280 || !menuOpen) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nav,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );

      gsap.fromTo(
        nav.querySelectorAll(".mobile-nav-link"),
        { opacity: 0, x: -6 },
        {
          opacity: 1,
          x: 0,
          duration: 0.22,
          stagger: 0.035,
          ease: "power2.out",
        }
      );
    }, nav);

    return () => ctx.revert();
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4c67a]/70 ${
      isActive
        ? "bg-[#eaf1df] text-[#314d2c]"
        : "text-[#687565] hover:bg-[#f1f5eb] hover:text-[#203626]"
    }`;

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-[#e2e7dc]/90 bg-[#f7f7f0]/95 text-[#19271e] shadow-[0_8px_35px_rgba(29,49,29,0.05)] backdrop-blur-xl"
    >
      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4c67a]/70"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d6e4c6] bg-[#eaf1df] text-[#52783d] transition duration-300 group-hover:rotate-[-5deg] group-hover:bg-[#dfeacb]">
            <Lightbulb size={23} strokeWidth={1.8} />
          </span>

          <span>
            <span className="block text-sm font-extrabold tracking-tight text-[#203626] sm:text-base">
              The Logic Lab<span className="text-[#7c9d4a]">.</span>
            </span>

            <span className="mt-0.5 hidden text-[9px] font-bold uppercase tracking-[0.18em] text-[#899383] sm:block">
              Explore · Visualize · Master
            </span>
          </span>
        </NavLink>

        <nav
          className="hidden items-center gap-1 2xl:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={navLinkClass}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#8eaf5a]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <NavLink
            to="/algorithms"
            aria-label="Browse algorithms"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e6db] bg-white/70 text-[#687565] transition hover:border-[#c7d8b6] hover:text-[#385b31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4c67a]/70"
          >
            <Search size={17} />
          </NavLink>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-xl border border-[#dce2d4] bg-white/60 px-4 py-2.5 text-sm font-semibold text-[#1b3324] transition-colors hover:bg-white"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-xl bg-[#1b3324] px-4 py-2.5 text-sm font-semibold text-[#f5f5e9] transition-colors hover:bg-[#2b4935]"
            >
              Get Started <span className="ml-1">↗</span>
            </button>
          </div>

          <NavLink
            to="/practice"
            onClick={closeMenu}
            className="hidden items-center gap-2 rounded-xl bg-[#203626] px-3.5 py-2.5 text-xs font-bold text-[#e6f6c9] transition hover:bg-[#2e4a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4c67a]/70 2xl:hidden lg:inline-flex"
          >
            Start practicing <ArrowUpRight size={15} />
          </NavLink>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e6db] bg-white/70 text-[#455944] transition hover:border-[#c7d8b6] xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav
        ref={mobileNavRef}
        id="primary-navigation"
        aria-label="Mobile navigation"
        className={`${
          menuOpen ? "block" : "hidden"
        } border-t border-[#e2e7dc] bg-[#f7f7f0] px-4 py-3 xl:hidden sm:px-6`}
      >
        <div className="mx-auto grid max-w-[1600px] gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `mobile-nav-link rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-[#d6e4c6] bg-[#eaf1df] text-[#314d2c]"
                    : "border-transparent text-[#687565] hover:bg-white hover:text-[#203626]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
