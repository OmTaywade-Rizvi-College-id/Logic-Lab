import { useId, useRef } from "react";
import { Activity, GitBranch, Route, Search, Waypoints } from "lucide-react";
import type { GraphStep } from "../types";
import type { GraphEdge, GraphNode } from "./GraphCanvas";

interface AlgorithmGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
  source: string;
  destination: string;
  search: string;
  resultPath: string[];
  step: GraphStep | null;
  revealedPathEdges: number;
  algorithmLabel: string;
}

export default function AlgorithmGraphCanvas({
  nodes,
  edges,
  directed,
  source,
  destination,
  search,
  resultPath,
  step,
  revealedPathEdges,
  algorithmLabel,
}: AlgorithmGraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  const gridId = `graph-grid-${id}`;
  const arrowId = `graph-arrow-${id}`;
  const visited = step?.visitedNodes ?? step?.visited ?? [];
  const currentNode = step?.currentNode ?? step?.node;
  const activeFrom = step?.edgeFrom ?? null;
  const activeTo = step?.edgeTo ?? null;
  const visiblePath = resultPath.slice(0, Math.max(0, revealedPathEdges + 1));

  function isPathEdge(edge: GraphEdge) {
    return visiblePath.some(
      (node, index) =>
        index < visiblePath.length - 1 &&
        ((edge.from === node && edge.to === visiblePath[index + 1]) ||
          (edge.to === node && edge.from === visiblePath[index + 1])),
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Waypoints size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Graph visualizer</p>
            <h3 className="truncate text-base font-semibold text-slate-900">{algorithmLabel}</h3>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live graph
        </span>
      </header>

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-2.5 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-emerald-600 bg-emerald-100" />Visited</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-amber-500 bg-amber-100" />Current node</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-emerald-600" />Path</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Traversal motion</span>
      </div>

      <div className="p-3">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <svg
            ref={svgRef}
            viewBox="0 0 620 380"
            className="block h-auto max-h-[420px] min-h-[220px] w-full"
            role="img"
            aria-label={`${algorithmLabel} graph visualization`}
          >
            <defs>
              <pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#cbd5e1" opacity="0.45" />
              </pattern>
              <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
              </marker>
            </defs>
            <rect width="620" height="380" fill="#f8fafc" />
            <rect width="620" height="380" fill={`url(#${gridId})`} />

            {edges.map((edge, index) => {
              const from = nodes.find((node) => node.id === edge.from);
              const to = nodes.find((node) => node.id === edge.to);
              if (!from || !to) return null;
              const highlighted = isPathEdge(edge);
              const isActiveEdge = Boolean(
                activeFrom && activeTo &&
                ((edge.from === activeFrom && edge.to === activeTo) ||
                  (!directed && edge.from === activeTo && edge.to === activeFrom))
              );
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;

              return (
                <g key={`${edge.from}-${edge.to}-${index}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isActiveEdge ? "#f59e0b" : highlighted ? "#059669" : "#94a3b8"}
                    strokeWidth={isActiveEdge ? 4 : highlighted ? 2.8 : 1.5}
                    strokeLinecap="round"
                    markerEnd={directed ? `url(#${arrowId})` : undefined}
                  />
                  {isActiveEdge && (
                    <g pointerEvents="none">
                      <circle r="6" fill="#fbbf24" opacity="0.25">
                        <animateMotion
                          dur="0.9s"
                          repeatCount="indefinite"
                          path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                        />
                      </circle>
                      <circle r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5">
                        <animateMotion
                          dur="0.9s"
                          repeatCount="indefinite"
                          path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                        />
                      </circle>
                    </g>
                  )}
                  <g>
                    <rect
                      x={midX - 12}
                      y={midY - 16}
                      width="24"
                      height="18"
                      rx="4"
                      fill={highlighted ? "#ecfdf5" : "#ffffff"}
                      stroke={highlighted ? "#a7f3d0" : "#dbe2ea"}
                    />
                    <text
                      x={midX}
                      y={midY - 4}
                      fill={highlighted ? "#047857" : "#475569"}
                      fontSize="11"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {edge.weight}
                    </text>
                  </g>
                </g>
              );
            })}

            {nodes.map((node) => {
              const isSource = node.id === source;
              const isDestination = node.id === destination;
              const isCurrent = node.id === currentNode;
              const isVisited = visited.includes(node.id);
              const isSearchMatch = search.length > 0 && node.id.toLowerCase().includes(search.toLowerCase());
              const isOnPath = visiblePath.includes(node.id);

              let stroke = "#94a3b8";
              let fill = "#ffffff";
              let textFill = "#334155";
              if (isVisited || isOnPath) {
                stroke = "#059669";
                fill = "#ecfdf5";
                textFill = "#047857";
              }
              if (isSource) {
                stroke = "#059669";
                fill = "#d1fae5";
                textFill = "#065f46";
              }
              if (isDestination) {
                stroke = "#d97706";
                fill = "#fffbeb";
                textFill = "#92400e";
              }
              if (isSearchMatch) {
                stroke = "#7c3aed";
                fill = "#f5f3ff";
                textFill = "#5b21b6";
              }
              if (isCurrent) {
                stroke = "#0f766e";
                fill = "#ccfbf1";
                textFill = "#115e59";
              }

              return (
                <g key={node.id}>
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="25"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      opacity="0.7"
                    >
                      <animate attributeName="r" values="22;29;22" dur="1.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.15;0.8" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={node.x} cy={node.y} r="21" fill={fill} stroke={stroke} strokeWidth={isCurrent ? 3 : 2} />
                  <text
                    x={node.x}
                    y={node.y + 4.5}
                    fill={textFill}
                    fontSize="13"
                    fontWeight="600"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}

            {nodes.length === 0 && (
              <text x="310" y="190" fill="#64748b" fontSize="14" textAnchor="middle">
                Add graph nodes to begin
              </text>
            )}
          </svg>
        </div>
      </div>

      <footer className="grid gap-2 border-t border-slate-200 px-3 py-3 sm:grid-cols-3">
        <InfoTile icon={<Route size={15} />} label="Source" value={source || "Not selected"} />
        <InfoTile icon={<GitBranch size={15} />} label="Destination" value={destination || "Not selected"} />
        <InfoTile icon={search ? <Search size={15} /> : <Activity size={15} />} label={search ? "Search query" : "Visited nodes"} value={search || visited.length} />
      </footer>
    </section>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-emerald-700 ring-1 ring-slate-200">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}