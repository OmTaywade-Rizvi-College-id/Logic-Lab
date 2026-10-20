

import { useEffect, useId, useRef } from "react";

import {

  Activity,

  CheckCircle2,

  CircleDot,

  GitBranch,

  ListChecks,

  Route,

  Waypoints,

} from "lucide-react";

import gsap from "gsap";

import type { GraphResult, GraphStep } from "../types";

type Props = {

  result: GraphResult | null;

  stepIndex: number;

  nodes: string[];

  onSelectStep: (index: number) => void;

};

function snapshot(

  step?: GraphStep,

): Record<string, number | string | null> {

  if (!step) return {};

  const value = step.distances ?? step.distanceSnapshot;

  return value && typeof value === "object" && !Array.isArray(value)

    ? (value as Record<string, number | string | null>)

    : {};

}

export default function ExecutionTrace({

  result,

  stepIndex,

  nodes,

  onSelectStep,

}: Props) {

  const rootRef = useRef<HTMLElement>(null);

  const detailsRef = useRef<HTMLDivElement>(null);

  const tableId = useId().replace(/:/g, "");

  const steps = result?.steps ?? [];

  const step = steps[stepIndex];

  const distances = snapshot(step);

  const visited = new Set(

    Array.isArray(step?.visitedNodes)

      ? step.visitedNodes

      : Array.isArray(step?.visited)

        ? step.visited

        : [],

  );

  const currentNode = step?.currentNode ?? step?.node;

  const progress = steps.length

    ? Math.min(100, ((stepIndex + 1) / steps.length) * 100)

    : 0;

  useEffect(() => {

    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {

      gsap.fromTo(

        ".trace-step",

        { opacity: 0, x: -8 },

        {

          opacity: 1,

          x: 0,

          duration: 0.35,

          stagger: 0.04,

          ease: "power2.out",

        },

      );

    }, root);

    return () => ctx.revert();

  }, [steps]);

  useEffect(() => {

    const details = detailsRef.current;

    if (!details) return;

    const ctx = gsap.context(() => {

      gsap.fromTo(

        details,

        { opacity: 0.6, y: 5 },

        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },

      );

    }, details);

    return () => ctx.revert();

  }, [stepIndex, step]);

  const resultPath =

    result?.path?.length

      ? result.path

      : [];

  return (

    <aside

      ref={rootRef}

      className="relative overflow-hidden rounded-2xl border border-[#e1e6dc] bg-white text-[#19271e] shadow-[0_14px_40px_rgba(33,55,33,0.055)] xl:sticky xl:top-5"

    >

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9acb61]/70 to-transparent" />

      {/* Header */}

      <div className="border-b border-[#e5e9df] px-5 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5e4c7] bg-[#eff5e6] text-[#60813b]">

            <ListChecks size={20} />

          </div>

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60813b]">

              Execution trace

            </p>

            <h2 className="mt-1 text-base font-semibold text-[#203725]">

              Algorithm steps

            </h2>

          </div>

        </div>

        <p className="mt-3 text-xs leading-5 text-[#7e8979]">

          Follow the execution details returned by your Java backend.

        </p>

        <div className="mt-4">

          <div className="mb-2 flex items-center justify-between text-xs">

            <span className="text-[#6f7c6c]">Progress</span>

            <span className="font-mono text-[#496b36]">

              {steps.length ? `${stepIndex + 1} / ${steps.length}` : "0 / 0"}

            </span>

          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[#f1f4ec]">

            <div

              className="h-full rounded-full bg-gradient-to-r from-[#9acb61] to-[#7abf9f] transition-[width] duration-300"

              style={{ width: `${progress}%` }}

            />

          </div>

        </div>

      </div>

      <div className="space-y-5 p-4 sm:p-5">

        {/* Selected step */}

        <div

          ref={detailsRef}

          className="rounded-xl border border-[#dce8d1] bg-[#f3f7ee] p-4"

        >

          <div className="mb-3 flex items-center gap-2">

            <Activity size={15} className="text-[#60813b]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#60813b]">

              Current action

            </span>

          </div>

          <h3 className="text-sm font-semibold leading-6 text-[#203725]">

            {step

              ? `${step.stepNumber ?? stepIndex + 1}. ${(step.action ?? "STEP").replace(/_/g, " ")}`

              : "Ready to execute"}

          </h3>

          <p className="mt-2 text-xs leading-6 text-[#6f7c6c]">

            {step?.explanation ??

              "Run an algorithm to inspect initialization, node visits, edge relaxation, and completion."}

          </p>

        </div>

        {/* Steps list */}

        <div>

          <div className="mb-3 flex items-center justify-between gap-2">

            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#203725]">

              <GitBranch size={16} className="text-[#60813b]" />

              Step timeline

            </h3>

            <span className="text-[10px] text-[#7e8979]">

              Select a step

            </span>

          </div>

          <div className="max-h-[330px] space-y-2 overflow-y-auto pr-1 [scrollbar-color:#334155_transparent] [scrollbar-width:thin]">

            {steps.map((item, index) => {

              const active = index === stepIndex;

              const completed = index < stepIndex;

              return (

                <button

                  type="button"

                  key={`${item.stepNumber ?? index}-${index}`}

                  aria-current={active ? "step" : undefined}

                  onClick={() => onSelectStep(index)}

                  className={`trace-step flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-200 ${

                    active

                      ? "border-[#cadcba] bg-[#edf4e5]"

                      : "border-[#e9ede5] bg-[#fcfdf9] hover:border-[#d6dfcc] hover:bg-[#f4f7ef]"

                  }`}

                >

                  <span

                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${

                      active

                        ? "border-[#cadcba] bg-[#edf4e5] text-[#496b36]"

                        : completed

                          ? "border-[#dce8d1] text-[#56823d]"

                          : "border-[#e1e6dc] text-[#7e8979]"

                    }`}

                  >

                    {completed ? (

                      <CheckCircle2 size={16} />

                    ) : active ? (

                      <CircleDot size={16} />

                    ) : (

                      index + 1

                    )}

                  </span>

                  <span className="min-w-0 flex-1">

                    <span

                      className={`block text-xs font-semibold leading-5 ${

                        active ? "text-[#496b36]" : "text-[#465947]"

                      }`}

                    >

                      {item.stepNumber ?? index + 1} ·{" "}

                      {(item.action ?? "STEP").replace(/_/g, " ")}

                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#7e8979]">

                      {item.explanation ?? "Step explanation not supplied."}

                    </span>

                  </span>

                </button>

              );

            })}

            {!steps.length && (

              <div className="rounded-xl border border-dashed border-[#dce3d6] px-4 py-7 text-center">

                <Waypoints size={23} className="mx-auto mb-3 text-[#929b8e]" />

                <p className="text-xs font-medium text-[#465947]">

                  No execution data yet

                </p>

                <p className="mt-2 text-xs leading-5 text-[#7e8979]">

                  Run the algorithm to populate the execution timeline.

                </p>

              </div>

            )}

          </div>

        </div>

        {/* Distance table */}

        <div>

          <div className="mb-3 flex items-center gap-2">

            <Route size={16} className="text-[#60813b]" />

            <h3 className="text-sm font-semibold text-[#203725]">

              Distance table

            </h3>

          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e1e6dc]">

            <table

              className="w-full min-w-[250px] text-left text-xs"

              aria-label="Node distances at current execution step"

            >

              <thead className="bg-[#f7f8f2] text-[#7e8979]">

                <tr>

                  <th className="px-3 py-3 font-medium">Node</th>

                  <th className="px-3 py-3 font-medium">Distance</th>

                  <th className="px-3 py-3 font-medium">State</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#e7ece3]">

                {step ? (

                  nodes.map((node) => {

                    const value = distances[node] ?? "∞";

                    const state =

                      node === currentNode

                        ? "Current"

                        : visited.has(node)

                          ? "Visited"

                          : "Pending";

                    return (

                      <tr

                        key={`${tableId}-${node}`}

                        className={

                          state === "Current"

                            ? "bg-[#f1f6e9] text-[#496b36]"

                            : "text-[#465947]"

                        }

                      >

                        <td className="px-3 py-2.5 font-semibold">{node}</td>

                        <td className="px-3 py-2.5 font-mono">

                          {String(value)}

                        </td>

                        <td className="px-3 py-2.5">

                          <span

                            className={`inline-flex items-center gap-1.5 ${

                              state === "Current"

                                ? "text-[#60813b]"

                                : state === "Visited"

                                  ? "text-[#56823d]"

                                  : "text-[#7e8979]"

                            }`}

                          >

                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {state}

                          </span>

                        </td>

                      </tr>

                    );

                  })

                ) : (

                  <tr>

                    <td

                      colSpan={3}

                      className="px-3 py-5 text-center text-[#7e8979]"

                    >

                      No execution data yet.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Algorithm result */}

        {result && (

          <div className="rounded-xl border border-[#dce8d1] bg-[#f1f7ed] p-4">

            <div className="flex items-center gap-2">

              <CheckCircle2 size={16} className="text-[#56823d]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#56823d]">

                Algorithm result

              </p>

            </div>

            <p className="mt-3 break-words text-sm font-semibold leading-6 text-[#496b36]">

              {resultPath.length > 0

                ? resultPath.join(" → ")

                : result.algorithm === "prim"

                  ? `${result.selectedEdges.length} edges selected`

                  : "No path found, or this algorithm does not produce a path."}

            </p>

            {result.algorithm === "prim" && (

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e2ebda] pt-3">

                <span className="text-xs text-[#6f7c6c]">

                  Minimum spanning tree weight

                </span>

                <strong className="text-sm text-[#203725]">

                  {result.totalWeight}

                </strong>

              </div>

            )}

            {result.algorithm === "dijkstra" && (

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e2ebda] pt-3">

                <span className="text-xs text-[#6f7c6c]">Path distance</span>

                <strong className="text-sm text-[#203725]">

                  {resultPath.length > 0

                    ? String(

                        result.distances[

                          resultPath[resultPath.length - 1]

                        ],

                      )

                    : "Unreachable"}

                </strong>

              </div>

            )}

            {result.error && (

              <p className="mt-3 rounded-lg border border-[#f0dcd6] bg-[#fff5f2] p-3 text-xs leading-5 text-[#ac5144]">

                {result.error}

              </p>

            )}

          </div>

        )}

      </div>

    </aside>

  );

}