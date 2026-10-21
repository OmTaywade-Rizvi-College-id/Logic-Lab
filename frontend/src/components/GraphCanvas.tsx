import { useEffect, useId, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  GitBranch,
  MousePointer2,
  Waypoints,
} from "lucide-react";
import gsap from "gsap";

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export type GraphMode = "normal" | "add-edge" | "delete";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode?: string;
  visitedNodes: string[];
  shortestPath: string[];
  mode: GraphMode;
  selectedNodes: string[];
  onNodeClick: (id: string) => void;
}

const MODE_STYLES: Record<
  GraphMode,
  { label: string; chip: string; dot: string }
> = {
  normal: {
    label: "Explore",
    chip: "border-[#b7d66e]/30 bg-[#b7d66e]/10 text-[#d9f99d]",
    dot: "bg-[#b7e878]",
  },
  "add-edge": {
    label: "Add edge",
    chip: "border-[#f3cf7a]/35 bg-[#f3cf7a]/10 text-[#f6d08a]",
    dot: "bg-[#f3cf7a]",
  },
  delete: {
    label: "Delete",
    chip: "border-rose-300/35 bg-rose-400/10 text-rose-200",
    dot: "bg-rose-300",
  },
};

// Colors used by both the SVG nodes and the legend, so they never drift apart.
const COLORS = {
  idle: { fill: "#27402d", stroke: "#7f967b" },
  visited: { fill: "#315333", stroke: "#7fb069" },
  path: { fill: "#45672f", stroke: "#d9f99d" },
  current: { fill: "#526f34", stroke: "#e6f6c9" },
  selected: { fill: "#66552b", stroke: "#f3cf7a" },
  edge: "#66816a",
  pathEdge: "#b7e878",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function GraphCanvas({
  nodes = [],
  edges = [],
  currentNode,
  visitedNodes = [],
  shortestPath = [],
  mode = "normal",
  selectedNodes = [],
  onNodeClick = () => {},
}: GraphCanvasProps) {
  const [showWeights, setShowWeights] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const gridId = `graph-grid-${useId().replace(/:/g, "")}`;
  const nodeRadius = 22;

  function getNode(id: string): GraphNode | undefined {
    return nodes.find((node) => node.id === id);
  }

  function isPathEdge(edge: GraphEdge): boolean {
    for (let index = 0; index < shortestPath.length - 1; index++) {
      const first = shortestPath[index];
      const second = shortestPath[index + 1];

      if (
        (edge.from === first && edge.to === second) ||
        (edge.from === second && edge.to === first)
      ) {
        return true;
      }
    }

    return false;
  }

  // One entrance on first paint: the graph draws itself in.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".graph-edge", {
        opacity: 0,
        duration: 0.5,
        stagger: 0.025,
        ease: "power2.out",
      });
      gsap.from(".graph-node", {
        opacity: 0,
        scale: 0.7,
        duration: 0.4,
        stagger: 0.045,
        ease: "back.out(1.6)",
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  // Shortest path edges flow in the direction of travel.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion()) return;

    const pathEdges = svg.querySelectorAll(".graph-path-edge");
    if (pathEdges.length === 0) return;

    const tween = gsap.to(pathEdges, {
      strokeDashoffset: -24,
      duration: 1.4,
      repeat: -1,
      ease: "none",
    });

    return () => {
      tween.kill();
    };
  }, [shortestPath, edges]);

  // The node being processed pulses.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion()) return;
    const current = svg.querySelector(".graph-current-node");

    if (!current) return;

    const tween = gsap.to(current, {
      opacity: 0.65,
      duration: 0.7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tween.kill();
      gsap.set(current, { opacity: 1 });
    };
  }, [currentNode]);

  const modeDescription =
    mode === "add-edge"
      ? "Select two nodes to connect them."
      : mode === "delete"
        ? "Select a node to delete it."
        : "Select nodes and explore the graph.";

  const modeStyle = MODE_STYLES[mode] ?? MODE_STYLES.normal;

  return (
    <section
      aria-label="Graph visualization"
      className="overflow-hidden rounded-2xl border border-[#2b4631] bg-[#203626] text-[#e6f6c9]"
    >
      {/* Header: what you are doing, how big the graph is, one toggle */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-6">
        <div className="min-w-0 flex-1 basis-64">
          <h3 className="text-xl font-semibold tracking-tight text-white">
            Graph visualization
          </h3>
          <p className="mt-1 text-sm leading-6 text-white/65">
            {modeDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${modeStyle.chip}`}
          >
            <MousePointer2 size={13} aria-hidden="true" />
            <span className="sr-only">Active mode: </span>
            {modeStyle.label}
          </span>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9f99d]/70"
            onClick={() => setShowWeights((previous) => !previous)}
            aria-pressed={showWeights}
          >
            {showWeights ? <EyeOff size={14} /> : <Eye size={14} />}
            {showWeights ? "Hide weights" : "Show weights"}
          </button>
        </div>
      </div>

      {/* SVG canvas */}
      <div className="px-3 sm:px-5">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#14251a]">
          <svg
            ref={svgRef}
            viewBox="0 0 620 380"
            role="group"
            aria-label="Interactive weighted graph"
            className="block h-auto max-h-[560px] min-h-[260px] w-full"
          >
            <defs>
              <pattern
                id={gridId}
                width="25"
                height="25"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#a4b9a0" opacity="0.15" />
              </pattern>

              <filter
                id={`${gridId}-glow`}
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="620" height="380" fill={`url(#${gridId})`} />

            {/* Edges */}
            {edges.map((edge, index) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);

              if (!from || !to) return null;
              const highlighted = isPathEdge(edge);
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              const label = String(edge.weight);
              const labelWidth = 14 + label.length * 7;

              return (
                <g key={`${edge.from}-${edge.to}-${index}`}>
                  <line
                    className={`graph-edge ${highlighted ? "graph-path-edge" : ""}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={highlighted ? COLORS.pathEdge : COLORS.edge}
                    strokeWidth={highlighted ? 3.5 : 1.7}
                    strokeOpacity={highlighted ? 1 : 0.6}
                    strokeDasharray={highlighted ? "8 6" : undefined}
                    strokeLinecap="round"
                    filter={
                      highlighted ? `url(#${gridId}-glow)` : undefined
                    }
                  />

                  {showWeights && (
                    <g pointerEvents="none">
                      <rect
                        x={midX - labelWidth / 2}
                        y={midY - 10}
                        width={labelWidth}
                        height="20"
                        rx="10"
                        fill={highlighted ? "#2f4a31" : "#203626"}
                        stroke={highlighted ? COLORS.pathEdge : "#596f55"}
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        fill={highlighted ? "#e6f6c9" : "#d1dec8"}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isCurrent = currentNode === node.id;
              const isVisited = visitedNodes.includes(node.id);
              const isSelected = selectedNodes.includes(node.id);
              const isInPath = shortestPath.includes(node.id);
              let palette = COLORS.idle;

              if (isVisited) palette = COLORS.visited;
              if (isInPath) palette = COLORS.path;
              if (isCurrent) palette = COLORS.current;
              if (isSelected) palette = COLORS.selected;

              return (
                <g
                  key={node.id}
                  className={`graph-node group ${isCurrent ? "graph-current-node" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select node ${node.id}`}
                  aria-pressed={isSelected}
                  onClick={() => onNodeClick(node.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onNodeClick(node.id);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    outline: "none",
                  }}
                >
                  {/* Keyboard focus ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius + 6}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="opacity-0 group-focus-visible:opacity-100"
                  />

                  {/* Current node halo */}
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 8}
                      fill="none"
                      stroke={COLORS.pathEdge}
                      strokeWidth="1.5"
                      opacity="0.45"
                    />
                  )}

                  {/* Hover halo shows what a click will do in the current mode */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius + 4}
                    fill="none"
                    stroke={mode === "delete" ? "#fda4af" : "#d9f99d"}
                    strokeWidth="1.5"
                    className="opacity-0 transition-opacity group-hover:opacity-60"
                  />

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={palette.fill}
                    stroke={palette.stroke}
                    strokeWidth={isSelected || isCurrent ? 3 : 2}
                  />

                  <text
                    x={node.x}
                    y={node.y + 4.5}
                    fill="#f4f8ed"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}

            {nodes.length === 0 && (
              <text
                x="310"
                y="185"
                fill="#aebba6"
                fontSize="14"
                textAnchor="middle"
              >
                Add nodes to start building your graph
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* Footer: legend (matches the node colors) and size */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 text-xs text-white/65 sm:px-6">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <LegendDot label="Current node" palette={COLORS.current} />
          <LegendDot label="Visited" palette={COLORS.visited} />
          <LegendDot label="Selected" palette={COLORS.selected} />
          <li className="inline-flex items-center gap-2">
            <span
              className="h-0.5 w-5 rounded"
              style={{ backgroundColor: COLORS.pathEdge }}
            />
            Shortest path
          </li>
        </ul>

        <p className="flex items-center gap-4 font-mono tabular-nums text-white/75">
          <span className="inline-flex items-center gap-1.5">
            <Waypoints size={14} className="text-[#d9f99d]" aria-hidden="true" />
            {nodes.length} {nodes.length === 1 ? "node" : "nodes"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GitBranch size={14} className="text-[#c0d9ae]" aria-hidden="true" />
            {edges.length} {edges.length === 1 ? "edge" : "edges"}
          </span>
        </p>
      </div>
    </section>
  );
}

function LegendDot({
  label,
  palette,
}: {
  label: string;
  palette: { fill: string; stroke: string };
}) {
  return (
    <li className="inline-flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-full border-2"
        style={{ backgroundColor: palette.fill, borderColor: palette.stroke }}
      />
      {label}
    </li>
  );
}

export default GraphCanvas;
