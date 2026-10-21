import { useEffect, useRef } from "react";
import {
  Activity,
  CheckCircle2,
  CircleDot,
  GitBranch,
  Route,
  Zap,
  BrainCircuit,
  Compass,
} from "lucide-react";
import gsap from "gsap";
interface InsightStep {
  action?: string;
  description?: string;
  visited?: string[];
  path?: string[];
  node?: string | null;
  distance?: number | string | null;
  reason?: string;
}
interface AlgorithmInsightsProps {
  nodes?: unknown[];
  edges?: unknown[];
  steps?: InsightStep[];
  stepIndex?: number;
  currentStep?: InsightStep | null;
  source?: string;
  destination?: string;
  shortestPath?: string[];
  totalDistance?: number | string | null;
}
const defaultSteps = [
  {
    title: "Initialize distances",
    detail:
      "Set the source distance to zero and all other distances to infinity.",
  },
  {
    title: "Explore the source",
    detail:
      "Start from the source node and examine its connected neighbors.",
  },
  {
    title: "Relax edges",
    detail:
      "Compare alternative distances and update a neighbor when a shorter route is found.",
  },
  {
    title: "Select the next node",
    detail:
      "Choose the unvisited node with the smallest tentative distance.",
  },
  {
    title: "Finalize the route",
    detail:
      "Reconstruct the shortest path using predecessor information.",
  },
];
export default function AlgorithmInsights({
  nodes = [],
  edges = [],
  steps = [],
  stepIndex = 0,
  currentStep = null,
  source = "",
  destination = "",
  shortestPath = [],
  totalDistance = null,
}: AlgorithmInsightsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const activeStep = steps[stepIndex] ?? currentStep;
  const visitedCount = new Set(activeStep?.visited ?? []).size;
  const route =
    shortestPath.length > 0 ? shortestPath : activeStep?.path ?? [];
  const hasResult =
    totalDistance !== null && totalDistance !== undefined;
  const insights = [
    {
      icon: CircleDot,
      label: "Graph Nodes",
      value: nodes.length,
      detail: "Vertices in your graph",
      accent: "text-[#668344]",
      iconBg: "bg-[#e9f0de]",
    },
    {
      icon: GitBranch,
      label: "Graph Edges",
      value: edges.length,
      detail: "Connections between nodes",
      accent: "text-[#52728d]",
      iconBg: "bg-[#e7eef4]",
    },
    {
      icon: Activity,
      label: "Nodes Visited",
      value: visitedCount,
      detail: "At the current step",
      accent: "text-[#78608b]",
      iconBg: "bg-[#eee8f3]",
    },
    {
      icon: Zap,
      label: "Execution Step",
      value: `${Math.min(stepIndex + 1, Math.max(steps.length, 1))} / ${Math.max(steps.length, 1)}`,
      detail: "Current progress",
      accent: "text-[#946a2b]",
      iconBg: "bg-[#f4ead6]",
    },
  ];
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".insight-stat",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.09,
          ease: "power3.out",
        },
      );
      gsap.fromTo(
        ".insights-bottom-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          delay: 0.15,
          ease: "power3.out",
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline-item-active",
        { x: -5, opacity: 0.65 },
        { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
      );
      gsap.fromTo(
        ".decision-highlight",
        { opacity: 0.7, y: 4 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    }, root);
    return () => ctx.revert();
  }, [stepIndex, activeStep]);
  return (
    <section
      ref={rootRef}
      className="relative space-y-6 text-[#203626]"
    >
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-7 bg-[#8eaa61]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#668344]">
              Under the hood
            </p>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#203626] sm:text-3xl">
            Algorithm <span className="text-[#668344]">Insights</span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#647265]">
            Understand the algorithm&apos;s progress, inspect each decision,
            and see how individual steps contribute to the result.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d2dfc2] bg-[#eef3e7] px-3 py-2 text-xs font-medium text-[#55733a]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8eaa61] opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8eaa61]" />
          </span>
          Step-by-step view
        </div>
      </div>
      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map(({ icon: Icon, label, value, detail, accent, iconBg }) => (
          <article
            key={label}
            className="insight-stat group relative overflow-hidden rounded-2xl border border-[#dfe5d9] bg-white p-5 transition-colors duration-300 hover:border-[#c5d9b3]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f6f8f3] blur-2xl transition-colors group-hover:bg-[#eaf1e2]" />
            <div className="relative flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-[#647265]">
                {label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${accent}`}
              >
                <Icon size={18} />
              </div>
            </div>
            <strong className="relative mt-5 block text-3xl font-semibold tracking-tight text-[#203626]">
              {value}
            </strong>
            <p className="relative mt-1 text-xs text-[#7c8777]">{detail}</p>
            <div className="mt-5 h-px w-full bg-white/[0.06]">
              <div className="h-px w-1/3 bg-gradient-to-r from-teal-300/70 to-transparent" />
            </div>
          </article>
        ))}
      </div>
      {/* Main insight panels */}
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        {/* Timeline */}
        <article className="insights-bottom-card overflow-hidden rounded-2xl border border-[#dfe5d9] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-[#e4e9df] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce6d0] bg-[#eaf1e2] text-[#668344]">
                <Route size={19} />
              </div>
              <div>
                <h3 className="font-semibold text-[#203626]">
                  Execution Timeline
                </h3>
                <p className="mt-1 text-xs text-[#7c8777]">
                  Review the algorithm&apos;s stages
                </p>
              </div>
            </div>
            <span className="rounded-lg border border-[#dfe5d9] bg-[#f5f7f2] px-2.5 py-1.5 text-xs text-[#647265]">
              {Math.min(stepIndex + 1, Math.max(steps.length, 1))}/
              {Math.max(steps.length, 1)}
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <div className="relative space-y-0">
              <div className="absolute bottom-7 left-[17px] top-7 w-px bg-gradient-to-b from-teal-300/40 via-slate-700 to-slate-800" />
              {defaultSteps.map((item, index) => {
                const isActive =
                  activeStep?.action === item.title ||
                  activeStep?.description === item.title;
                const isCurrent = index === stepIndex;
                const isCompleted = index < stepIndex;
                const selected = isCurrent || isActive;
                return (
                  <div
                    key={item.title}
                    className={`timeline-item relative flex gap-4 rounded-xl px-2 py-4 transition-colors duration-300 ${
                      selected ? "timeline-item-active bg-[#f0f4e9]" : ""
                    }`}
                  >
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9e2d5] bg-[#edf2e7] text-xs font-semibold text-[#647265]">
                      {isCompleted ? (
                        <CheckCircle2
                          size={17}
                          className="text-[#668344]"
                        />
                      ) : selected ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#a9c58d] bg-[#8eaa61]/10 text-[#55733a]">
                          {index + 1}
                        </span>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            selected
                              ? "text-[#55733a]"
                              : isCompleted
                                ? "text-[#354936]"
                                : "text-[#647265]"
                          }`}
                        >
                          {item.title}
                        </h4>
                        {selected && (
                          <span className="rounded-md border border-[#d2dfc2] bg-[#eaf1e2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#668344]">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-[#7c8777]">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
        {/* Decision inspector */}
        <article className="insights-bottom-card overflow-hidden rounded-2xl border border-[#dfe5d9] bg-white">
          <div className="flex items-center gap-3 border-b border-[#e4e9df] px-5 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2d8ed] bg-violet-300/[0.07] text-[#78608b]">
              <BrainCircuit size={19} />
            </div>
            <div>
              <h3 className="font-semibold text-[#203626]">
                Decision Inspector
              </h3>
              <p className="mt-1 text-xs text-[#7c8777]">
                Examine the current execution state
              </p>
            </div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="decision-highlight relative overflow-hidden rounded-xl border border-[#dce6d0] bg-gradient-to-br from-teal-300/[0.09] to-transparent p-4">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#eef3e7] blur-2xl" />
              <div className="relative mb-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#668344]">
                  Step {steps.length > 0 ? stepIndex + 1 : 0}
                </span>
                <Activity size={17} className="text-[#668344]" />
              </div>
              <h4 className="relative text-lg font-semibold text-[#203626]">
                {activeStep?.action ||
                  activeStep?.description ||
                  "Ready to explore"}
              </h4>
              <p className="relative mt-2 text-sm leading-6 text-[#647265]">
                {activeStep?.description ||
                  "Run the algorithm or select an execution step to see what changes."}
              </p>
            </div>
            {/* Current state */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Compass size={15} className="text-[#647265]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#465746]">
                  Current state
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#e4e9df] bg-[#f6f8f3] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#7c8777]">
                    Source
                  </p>
                  <p className="mt-2 truncate text-sm font-semibold text-[#55733a]">
                    {source || "Not selected"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e4e9df] bg-[#f6f8f3] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#7c8777]">
                    Destination
                  </p>
                  <p className="mt-2 truncate text-sm font-semibold text-[#946a2b]">
                    {destination || "Not selected"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e4e9df] bg-[#f6f8f3] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#7c8777]">
                    Current node
                  </p>
                  <p className="mt-2 truncate text-sm font-semibold text-[#203626]">
                    {activeStep?.node || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e4e9df] bg-[#f6f8f3] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#7c8777]">
                    Current distance
                  </p>
                  <p className="mt-2 truncate text-sm font-semibold text-[#203626]">
                    {activeStep?.distance ?? "—"}
                  </p>
                </div>
              </div>
            </div>
            {/* Reasoning */}
            <div className="rounded-xl border border-[#e4e9df] bg-[#f5f7f0] p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                <h4 className="text-xs font-semibold text-[#354936]">
                  Why this matters
                </h4>
              </div>
              <p className="text-xs leading-6 text-[#647265]">
                {activeStep?.reason ||
                  "Each step helps explain how the algorithm explores the graph."}
              </p>
            </div>
            {/* Result */}
            <div className="rounded-xl border border-[#dce6d0] bg-[#f0f4e9] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Route size={15} className="text-[#668344]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#668344]">
                  Shortest path discovered
                </span>
              </div>
              {route.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {route.map((node, index) => (
                    <div key={`${node}-${index}`} className="flex items-center gap-2">
                      <span className="rounded-lg border border-[#d2dfc2] bg-[#e9f0de] px-2.5 py-1.5 text-xs font-semibold text-[#3f572b]">
                        {node}
                      </span>
                      {index < route.length - 1 && (
                        <span className="text-[#668344]">→</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#7c8777]">Not available yet</p>
              )}
              {hasResult && (
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-teal-300/10 pt-3">
                  <span className="text-xs text-[#647265]">
                    Total distance
                  </span>
                  <strong className="text-sm font-semibold text-[#203626]">
                    {totalDistance}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}