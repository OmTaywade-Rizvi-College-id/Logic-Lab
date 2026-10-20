import { useEffect, useState } from "react";
import { Plus, Trash2, RotateCcw, Play } from "lucide-react";
import type { Edge } from "../types";

interface Props {
  edges: Edge[];
  onChange: (index: number, field: keyof Edge, value: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onReset: () => void;
  onApply: () => void;
  disabled?: boolean;
}

export default function GraphEditor({
  edges,
  onChange,
  onAdd,
  onDelete,
  onReset,
  onApply,
  disabled = false,
}: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setDrafts({});
  }, [edges]);

  const updateField = (
    index: number,
    field: keyof Edge,
    value: string,
  ) => {
    if (field === "weight") {
      setDrafts((current) => ({
        ...current,
        [`${index}-weight`]: value,
      }));

      if (value.trim() !== "" && Number.isFinite(Number(value))) {
        onChange(index, field, value);
      }
      return;
    }

    onChange(index, field, value);
  };

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Edit graph edges
        </h3>

        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#203626] px-3 py-2 text-xs font-medium text-white hover:bg-[#365b35] disabled:opacity-40"
        >
          <Plus size={14} />
          Add edge
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {edges.map((edge, index) => (
          <div
            key={`${edge.from}-${edge.to}-${index}`}
            className="grid grid-cols-1 items-center gap-2 py-3 sm:grid-cols-[1fr_1fr_100px_auto]"
          >
            <label className="text-xs text-slate-500">
              From
              <input
                value={edge.from}
                onChange={(event) =>
                  updateField(index, "from", event.target.value)
                }
                disabled={disabled}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-800"
              />
            </label>

            <label className="text-xs text-slate-500">
              To
              <input
                value={edge.to}
                onChange={(event) =>
                  updateField(index, "to", event.target.value)
                }
                disabled={disabled}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-800"
              />
            </label>

            <label className="text-xs text-slate-500">
              Weight
              <input
                type="number"
                value={drafts[`${index}-weight`] ?? String(edge.weight)}
                onChange={(event) =>
                  updateField(index, "weight", event.target.value)
                }
                disabled={disabled}
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-800"
              />
            </label>

            <button
              type="button"
              onClick={() => onDelete(index)}
              disabled={disabled}
              aria-label={`Delete edge ${edge.from} to ${edge.to}`}
              className="justify-self-start rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 sm:mt-4"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {edges.length === 0 && (
          <p className="py-4 text-sm text-slate-500">
            No edges in the graph. Add an edge to get started.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <RotateCcw size={14} />
          Reset graph
        </button>

        <button
          type="button"
          onClick={onApply}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#203626] px-3 py-2 text-xs font-medium text-white hover:bg-[#365b35] disabled:opacity-40"
        >
          <Play size={13} />
          Run algorithm
        </button>
      </div>
    </section>
  );
}