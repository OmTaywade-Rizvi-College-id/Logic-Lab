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
  id: string
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
  const panelRef = useRef<HTMLElement>(null);
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

  function getEdgeLabelPosition(edge: GraphEdge) {
    const from = getNode(edge.from);
    const to = getNode(edge.to);
    if (!from || !to) return { x: 0, y: 0 };

    return {
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2 - 9,
    };
  }

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );
    }, panel);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".graph-edge",
        { opacity: 0, strokeDashoffset: 24 },
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 0.45,
          stagger: 0.025,
          ease: "power2.out",
        },
      );
      gsap.fromTo(
        ".graph-node",
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.045,
          ease: "back.out(1.6)",
        },
      );
    }, svg);

    return () => ctx.revert();
  }, [nodes, edges]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
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
    };
  }, [currentNode]);

  const modeDescription =
    mode === "add-edge"
      ? "Select two nodes to connect them."
      : mode === "delete"
        ? "Select a node to delete it."
        : "Select nodes and explore the graph.";

  return (
    <section
      ref={panelRef}
      className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#203626] text-slate-100 shadow-[0_20px_65px_rgba(0,0,0,0.16)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#b7d66e]/5 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.10] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#b8d58f]/30 bg-[#b7d66e]/10 text-[#d9f99d]">
            <Waypoints size={21} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9f99d]">
              Interactive workspace
            </p>

            <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
              Graph Visualization
            </h3>

            <p className="mt-1 text-xs leading-5 text-white/60">
              {modeDescription}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-xs font-medium text-white/75 transition-colors hover:border-[#d9f99d]/40 hover:text-[#e6f6c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9f99d]/60"
          onClick={() => setShowWeights((previous) => !previous)}
          aria-pressed={showWeights}
        >
          {showWeights ? <EyeOff size={15} /> : <Eye size={15} />}
          {showWeights ? "Hide weights" : "Show weights"}
        </button>
      </div>

      {/* Status and legend */}

      <div className="relative flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-white/[0.08] px-5 py-3 text-xs text-white/60 sm:px-6">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-teal-300 bg-teal-300/10" />
          Current node
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-emerald-300 bg-emerald-300/10" />

          Visited
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-cyan-300 bg-cyan-300/10" />
          Selected
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-4 rounded bg-gradient-to-r from-teal-300 to-cyan-300" />
          Shortest path
        </span>
      </div>

      {/* SVG canvas */}

      <div className="relative p-3 sm:p-5">
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#14251a]">
          <svg
            ref={svgRef}
            viewBox="0 0 620 380"
            role="img"
            aria-label="Interactive weighted graph visualization"
            className="block h-auto max-h-[520px] min-h-[250px] w-full"
          >
            <defs>
              <pattern
                id={gridId}
                width="25"
                height="25"
                patternUnits="userSpaceOnUse"
              >

                <circle
                  cx="1"
                  cy="1"
                  r="1"
                  fill="#a4b9a0"
                  opacity="0.15"
                />
              </pattern>

              <linearGradient
                id={`${gridId}-path`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#b7e878" />
                <stop offset="100%" stopColor="#f3cf7a" />
              </linearGradient>

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
              const labelPosition = getEdgeLabelPosition(edge);

              return (

                <g key={`${edge.from}-${edge.to}-${index}`}>
                  <line
                    className="graph-edge"
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    fill="none"
                    stroke={
                      highlighted
                        ? `url(#${gridId}-path)`
                        : "#66816a"
                    }
                    strokeWidth={highlighted ? 3.5 : 1.7}
                    strokeOpacity={highlighted ? 1 : 0.65}
                    strokeDasharray={highlighted ? "7 5" : "0"}
                    strokeDashoffset="24"
                    strokeLinecap="round"
                    filter={
                      highlighted ? `url(#${gridId}-glow)` : undefined
                    }
                  />

                  {showWeights && (
                    <g>
                      <rect
                        x={labelPosition.x - 15}
                        y={labelPosition.y - 10}
                        width="30"
                        height="20"
                        rx="6"
                        fill="#203626"
                        stroke={highlighted ? "#b7e878" : "#596f55"}
                        strokeWidth="0.8"
                      />
                      <text
                        x={labelPosition.x}
                        y={labelPosition.y + 4}
                        fill={highlighted ? "#e6f6c9" : "#d1dec8"}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {edge.weight}
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
              let fill = "#27402d";
              let stroke = "#7f967b";

              if (isVisited) {
                fill = "#315333";
                stroke = "#b7e878";
              }

              if (isInPath) {
                fill = "#45672f";
                stroke = "#b7e878";
              }

              if (isCurrent) {
                fill = "#526f34";
                stroke = "#e6f6c9";
              }

              if (isSelected) {
                fill = "#66552b";
                stroke = "#f3cf7a";
              }

              return (
                <g
                  key={node.id}
                  className={`graph-node ${isCurrent ? "graph-current-node" : ""}`}
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
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 8}
                      fill="none"
                      stroke="#b7e878"
                      strokeWidth="1.5"
                      opacity="0.4"
                    />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={fill}
                    stroke={stroke}
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

      {/* Footer statistics */}
      <div className="grid gap-3 border-t border-white/[0.10] px-5 py-4 sm:grid-cols-3 sm:px-6">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b7d66e]/10 text-[#d9f99d]">
            <Waypoints size={17} />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Nodes
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {nodes.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-[#c0d9ae]">
            <GitBranch size={17} />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Edges
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {edges.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f6d08a]/10 text-[#f6d08a]">
            <MousePointer2 size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-white/45">
              Active mode
            </p>
            <p className="mt-1 truncate text-sm font-semibold capitalize text-white">
              {mode === "add-edge" ? "Add edge" : mode}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GraphCanvas;