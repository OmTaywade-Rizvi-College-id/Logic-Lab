
import type { GraphStep } from "../types";

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

interface Props {
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
}: Props) {
  const width = 620;
  const height = 360;
  const radius = 19;

  const activeNode = step?.currentNode ?? "";

  const isPathEdge = (edge: GraphEdge) => {
    for (let i = 0; i < resultPath.length - 1; i++) {
      const from = resultPath[i];
      const to = resultPath[i + 1];

      if (
        (edge.from === from && edge.to === to) ||
        (!directed && edge.from === to && edge.to === from)
      ) {
        if (i < revealedPathEdges) return true;
      }
    }

    return false;
  };

  const getNodeColor = (id: string) => {
    if (id === activeNode) return "#f59e0b";
    if (id === source) return "#16a34a";
    if (id === destination) return "#dc2626";
    if (id === search) return "#0d9488";
    if (resultPath.includes(id)) return "#d1fae5";
    return "#ffffff";
  };

  const getTextColor = (id: string) => {
    if (
      id === activeNode ||
      id === source ||
      id === destination ||
      id === search
    ) {
      return "#ffffff";
    }

    return "#1f2937";
  };

  return (
    <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Graph visualization
          </h3>
          <p className="mt-1 text-xs text-slate-500">{algorithmLabel}</p>
        </div>

        <span className="text-xs text-slate-500">
          {directed ? "Directed" : "Undirected"}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${algorithmLabel} graph visualization`}
          className="block h-auto w-full min-w-[420px]"
        >
          {edges.map((edge, index) => {
            const from = nodes.find((node) => node.id === edge.from);
            const to = nodes.find((node) => node.id === edge.to);

            if (!from || !to) return null;

            const highlighted = isPathEdge(edge);

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;

            const startX = from.x + (dx / distance) * radius;
            const startY = from.y + (dy / distance) * radius;
            const endX = to.x - (dx / distance) * radius;
            const endY = to.y - (dy / distance) * radius;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={highlighted ? "#16a34a" : "#cbd5e1"}
                  strokeWidth={highlighted ? 3 : 1.5}
                  strokeLinecap="round"
                  markerEnd={
                    directed ? "url(#graph-arrow)" : undefined
                  }
                />

                {Number.isFinite(edge.weight) && (
                  <text
                    x={midX}
                    y={midY - 7}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#64748b"
                    stroke="white"
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          <defs>
            <marker
              id="graph-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={getNodeColor(node.id)}
                stroke={
                  node.id === activeNode ? "#b45309" : "#cbd5e1"
                }
                strokeWidth={node.id === activeNode ? 2 : 1.5}
              />

              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill={getTextColor(node.id)}
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
          Source
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
          Destination
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Current node
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-green-600" />
          Result path
        </span>
      </div>
    </section>
  );
}