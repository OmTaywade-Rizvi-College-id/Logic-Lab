import type { AlgorithmConfig } from "../algorithms/algorithmRegistry";

interface Props {
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
}

export default function GraphInputs({
  algorithm,
  source,
  destination,
  search,
  directed,
  onSource,
  onDestination,
  onSearch,
  onDirected,
  onRun,
  nodes,
  busy,
}: Props) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Source node */}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Source node
        </span>

        <select
          value={source}
          onChange={(event) => onSource(event.target.value)}
          disabled={busy}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
        >
          {nodes.map((node) => (
            <option key={node} value={node}>
              {node}
            </option>
          ))}
        </select>
      </label>

      {/* Destination node */}
      {algorithm.requiresDestination && (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Destination node
          </span>

          <select
            value={destination}
            onChange={(event) => onDestination(event.target.value)}
            disabled={busy}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
          >
            {nodes.map((node) => (
              <option key={node} value={node}>
                {node}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Search node */}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Search node
        </span>

        <input
          type="text"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Enter node to find"
          disabled={busy}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
        />
      </label>

      {/* Directed / undirected */}
      <label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={directed}
          onChange={(event) => onDirected(event.target.checked)}
          disabled={busy || algorithm.id === "prim"}
          className="h-4 w-4 accent-emerald-700"
        />
        Directed graph
      </label>

      {/* Run algorithm */}
      <div className="sm:col-span-2">
        <button
          type="button"
          onClick={onRun}
          disabled={busy || nodes.length === 0}
          className="rounded-lg bg-[#203626] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#365b35] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Running..." : `Run ${algorithm.label}`}
        </button>
      </div>
    </section>
  );
}