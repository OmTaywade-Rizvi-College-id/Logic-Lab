import { useMemo } from "react";
import type { Edge, GraphStep } from "../../types";

interface GraphCanvasProps {
  nodes: string[];
  edges: Edge[];
  directed?: boolean;
  step?: GraphStep | null;
  startNode?: string;
  endNode?: string;
}

interface Position {
  x: number;
  y: number;
}

export default function GraphCanvas({
  nodes,
  edges,
  directed = false,
  step,
  startNode,
  endNode,
}: GraphCanvasProps) {
  const positions = useMemo(() => {
    const map = new Map<string, Position>();
    const width = 640;
    const height = 390;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width * 0.38, height * 0.38);

    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / Math.max(nodes.length, 1) -
        Math.PI / 2;

      map.set(node, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    });

    return map;
  }, [nodes]);

  if (nodes.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-[#cbd6c2] bg-[#f7f9f3] p-8 text-sm text-[#73836d]">
        Add graph nodes to begin.
      </div>
    );
  }

  const visited = new Set(step?.visitedNodes ?? []);
  const selected = step?.selectedEdges ?? [];
  const activeEdge = step?.activeEdge;

  const isSelected = (edge: Edge) =>
    selected.some(
      (candidate) =>
        (candidate.from === edge.from && candidate.to === edge.to) ||
        (!directed &&
          candidate.from === edge.to &&
          candidate.to === edge.from),
    );

  const isActive = (edge: Edge) =>
    activeEdge !== undefined &&
    ((activeEdge.from === edge.from && activeEdge.to === edge.to) ||
      (!directed &&
        activeEdge.from === edge.to &&
        activeEdge.to === edge.from));

  return (
    <section className="overflow-hidden rounded-2xl border border-[#294631] bg-[#13291c] p-3 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold text-[#f2f6ec]">Graph visualization</h2>
          <p className="mt-1 text-xs text-[#a8b8a0]">
            {step?.message ?? "Run an algorithm to begin traversal."}
          </p>
        </div>
        <div className="text-xs text-[#a8b8a0]">
          {visited.size} / {nodes.length} visited
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-[#102319]">
        <svg
          viewBox="0 0 640 390"
          role="img"
          aria-label="Graph algorithm animation"
          className="mx-auto block w-full min-w-[420px] max-w-3xl"
        >
          <defs>
            <marker
              id="graph-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L6,3 z" fill="#8fa58a" />
            </marker>
          </defs>

          {edges.map((edge, index) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) return null;

            const chosen = isSelected(edge);
            const active = isActive(edge);

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.hypot(dx, dy) || 1;
            const unitX = dx / length;
            const unitY = dy / length;
            const startX = from.x + unitX * 23;
            const startY = from.y + unitY * 23;
            const endX = to.x - unitX * 27;
            const endY = to.y - unitY * 27;
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={active ? "#f0d582" : chosen ? "#c4e58c" : "#617b60"}
                  strokeWidth={active || chosen ? 4 : 2}
                  markerEnd={directed ? "url(#graph-arrow)" : undefined}
                  className="transition-all duration-300"
                />
                <rect
                  x={midX - 17}
                  y={midY - 12}
                  width="34"
                  height="23"
                  rx="7"
                  fill="#1c3825"
                  stroke="#486747"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#edf4e5"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const point = positions.get(node)!;
            const isVisited = visited.has(node);
            const isCurrent = step?.currentNode === node;
            const isStart = startNode === node;
            const isEnd = endNode === node;

            const fill = isCurrent
              ? "#f0d582"
              : isVisited
                ? "#c4e58c"
                : "#294631";

            return (
              <g key={node} className="transition-all duration-300">
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="23"
                  fill={fill}
                  stroke={isStart || isEnd ? "#f6f8f1" : "#789574"}
                  strokeWidth={isStart || isEnd ? 3 : 1.5}
                />
                <text
                  x={point.x}
                  y={point.y + 5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill={isCurrent ? "#3e351c" : isVisited ? "#203626" : "#f6f8f1"}
                >
                  {node}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {step && (
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <StateBox label="Queue" value={step.queue.join(" → ") || "Empty"} />
          <StateBox label="Stack" value={step.stack.join(" → ") || "Empty"} />
          <StateBox
            label="Total selected weight"
            value={String(step.totalWeight)}
          />
        </div>
      )}
    </section>
  );
}

function StateBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#304d35] bg-[#1b3524] p-3">
      <p className="text-xs text-[#a8b8a0]">{label}</p>
      <p className="mt-1 break-words font-medium text-[#f2f6ec]">{value}</p>
    </div>
  );
}