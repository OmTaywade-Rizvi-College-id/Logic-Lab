import { useEffect, useRef } from "react";
import { Play, Search, GitBranch, Flag, CircleDot, ArrowRight } from "lucide-react";
import gsap from "gsap";
import type { AlgorithmConfig } from "../types";

type Props = {
  nodes: string[];
  source: string;
  destination: string;
  search: string;
  directed: boolean;
  algorithm: AlgorithmConfig;
  onSource: (value: string) => void;
  onDestination: (value: string) => void;
  onSearch: (value: string) => void;
  onDirected: (value: boolean) => void;
  onRun: () => void;
  busy: boolean;
};

export default function GraphInputs({
  nodes,
  source,
  destination,
  search,
  directed,
  algorithm,
  onSource,
  onDestination,
  onSearch,
  onDirected,
  onRun,
  busy,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".graph-input-field",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const field =
    "w-full rounded-xl border border-[#dfe6d8] bg-[#fbfcf8] px-3.5 py-3 text-sm text-[#263a29] outline-none transition duration-200 hover:border-[#cbd8bf] focus:border-[#9db783] focus:ring-4 focus:ring-[#a9c78d]/20 disabled:cursor-not-allowed disabled:opacity-50";
  const labelClass = "mb-2 block text-xs font-semibold text-[#758171]";

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden rounded-[26px] border border-[#e2e7dc] bg-white p-5 text-[#19271e] shadow-[0_12px_38px_rgba(29,49,29,0.055)] sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#dcebc7]/60 blur-3xl" />

      <div className="relative mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d6e4c6] bg-[#eaf1df] text-[#52783d]">
          <GitBranch size={21} />
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6e8c4b]">
            Configuration
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[#203626]">
            {algorithm.label} inputs
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#778176]">
            {algorithm.description}
          </p>
        </div>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <label className="graph-input-field block min-w-0">
          <span className={labelClass}>
            {algorithm.id === "prim" ? "Starting node" : "Source node"}
          </span>
          <span className="relative block">
            <CircleDot size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718f4e]" />
            <select
              className={`${field} pl-9`}
              value={source}
              disabled={nodes.length === 0}
              onChange={(event) => onSource(event.target.value)}
            >
              <option value="" disabled>Select source</option>
              {nodes.map((node) => <option key={node} value={node}>{node}</option>)}
            </select>
          </span>
        </label>

        {algorithm.requiresDestination && (
          <label className="graph-input-field block min-w-0">
            <span className={labelClass}>Destination node</span>
            <span className="relative block">
              <Flag size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a17a35]" />
              <select
                className={`${field} pl-9`}
                value={destination}
                disabled={nodes.filter((node) => node !== source).length === 0}
                onChange={(event) => onDestination(event.target.value)}
              >
                <option value="" disabled>Select destination</option>
                {nodes.filter((node) => node !== source).map((node) => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
            </span>
          </label>
        )}

        <label className="graph-input-field block sm:col-span-2">
          <span className={labelClass}>
            <span className="inline-flex items-center gap-2">
              <Search size={14} className="text-[#718f4e]" />
              Search / highlight node
            </span>
          </span>
          <input
            className={field}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Type a node name, e.g. C"
          />
        </label>

        <label className="graph-input-field flex cursor-pointer items-center gap-3 rounded-xl border border-[#e2e7dc] bg-[#fafbf7] px-4 py-3.5 transition hover:border-[#cbd8bf] sm:col-span-2">
          <input
            type="checkbox"
            checked={directed}
            onChange={(event) => onDirected(event.target.checked)}
            className="h-4 w-4 accent-[#638640]"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[#344936]">Directed graph</span>
            <span className="mt-1 block text-xs text-[#879083]">
              {algorithm.id === "prim"
                ? "Prim's algorithm requires an undirected graph."
                : "Configure the direction of graph edges."}
            </span>
          </span>
          <ArrowRight size={16} className="shrink-0 text-[#9ba595]" />
        </label>
      </div>

      {nodes.length < 2 && (
        <p className="relative mt-4 rounded-xl border border-[#ead7a7] bg-[#fbf5e6] px-3 py-2.5 text-xs leading-5 text-[#8d6725]">
          Add at least two nodes before running the algorithm.
        </p>
      )}

      <button
        type="button"
        onClick={onRun}
        disabled={busy || nodes.length < 2}
        className="relative mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#203626] px-4 py-3 text-sm font-bold text-[#e6f6c9] shadow-[0_6px_24px_rgba(45,70,33,0.12)] transition duration-200 hover:bg-[#2e4a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4c67a] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Play size={16} fill="currentColor" />
        {busy ? "Running algorithm…" : `Run ${algorithm.label}`}
      </button>
    </section>
  );
}