import { useEffect, useRef } from "react";
import { Plus, RotateCcw, Trash2, Check, GitBranch, Pencil } from "lucide-react";
import gsap from "gsap";
import type { Edge } from "../types";
import SectionCard from "./SectionCard";

type Props = {
  edges: Edge[];
  onChange: (index: number, field: keyof Edge, value: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onReset: () => void;
  onApply: () => void;
};

export default function GraphEditor({
  edges,
  onChange,
  onAdd,
  onDelete,
  onReset,
  onApply,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".edge-row",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.035, ease: "power2.out" },
      );
    }, root);

    return () => ctx.revert();
  }, [edges.length]);

  const buttonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4c67a]/60 sm:text-sm";
  const inputClass =
    "w-full min-w-20 rounded-lg border border-[#e0e6da] bg-[#fbfcf8] px-3 py-2.5 font-mono text-sm text-[#36543a] outline-none transition focus:border-[#9db783] focus:ring-2 focus:ring-[#a9c78d]/20";

  return (
    <div ref={rootRef}>
      <SectionCard
        number="04"
        eyebrow="Graph editor"
        title="Change graph values"
        description="Edit weighted edges, then apply your changes to run the algorithm."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`${buttonClass} border-[#d6e4c6] bg-[#edf4e3] text-[#3e6131] hover:bg-[#e3edda]`}
              onClick={onAdd}
            >
              <Plus size={15} /> Add edge
            </button>
            <button
              type="button"
              className={`${buttonClass} border-[#e1e6db] bg-white text-[#687565] hover:bg-[#f5f8ef]`}
              onClick={onReset}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#778176]">
            <GitBranch size={15} className="text-[#718f4e]" />
            Each row represents one weighted edge.
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8cd] bg-[#f2f7eb] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#55783b]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8daf5a]" /> Live editing
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#e4e9df]">
          <table className="w-full min-w-[470px] text-left text-sm">
            <thead className="bg-[#f6f8f2] text-[10px] uppercase tracking-[0.15em] text-[#879083]">
              <tr>
                <th className="px-4 py-3 font-bold">From</th>
                <th className="px-4 py-3 font-bold">To</th>
                <th className="px-4 py-3 font-bold">Weight</th>
                <th className="px-4 py-3 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0e9]">
              {edges.map((edge, index) => (
                <tr
                  key={`${index}-${edge.from}-${edge.to}`}
                  className="edge-row bg-white transition-colors hover:bg-[#fafbf7]"
                >
                  <td className="px-3 py-3">
                    <input
                      aria-label={`Edge ${index + 1} source`}
                      className={inputClass}
                      value={edge.from}
                      onChange={(event) => onChange(index, "from", event.target.value)}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      aria-label={`Edge ${index + 1} destination`}
                      className={inputClass}
                      value={edge.to}
                      onChange={(event) => onChange(index, "to", event.target.value)}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      aria-label={`Edge ${index + 1} weight`}
                      className={inputClass}
                      type="number"
                      min="0"
                      step="any"
                      value={edge.weight}
                      onChange={(event) => onChange(index, "weight", event.target.value)}
                    />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0d9d5] bg-[#fff6f4] text-[#b55245] transition hover:border-[#e6b7af] hover:bg-[#ffefeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/50"
                      aria-label={`Remove edge ${index + 1}`}
                      onClick={() => onDelete(index)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {edges.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <Pencil size={22} className="mx-auto mb-3 text-[#a0aa99]" />
                    <p className="text-sm font-semibold text-[#344936]">No edges available</p>
                    <p className="mt-1 text-xs text-[#899383]">
                      Add an edge to begin editing your graph.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e9ede5] pt-4">
          <span className="text-xs text-[#899383]">
            {edges.length} {edges.length === 1 ? "edge" : "edges"} configured
          </span>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203626] px-4 py-3 text-sm font-bold text-[#e6f6c9] transition hover:bg-[#2e4a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4c67a]/60"
            onClick={onApply}
          >
            <Check size={16} /> Apply &amp; run algorithm
          </button>
        </div>
      </SectionCard>
    </div>
  );
}