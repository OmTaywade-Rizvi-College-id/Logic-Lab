

import { useEffect, useRef } from "react";

import {

  Activity,

  CheckCircle2,

  CircleDot,

  ListOrdered,

  Waypoints,

} from "lucide-react";

import gsap from "gsap";

interface ExecutionStep {

  id: string | number;

  description: string;

  action: string;

  node?: string | null;

  distance: number | string | null;

  reason: string;

}

interface ExecutionStepsProps {

  steps: ExecutionStep[];

  stepIndex: number;

  onSelectStep: (index: number) => void;

}

export default function ExecutionSteps({

  steps,

  stepIndex,

  onSelectStep,

}: ExecutionStepsProps) {

  const rootRef = useRef<HTMLElement>(null);

  const detailsRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[stepIndex];

  useEffect(() => {

    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {

      gsap.fromTo(

        ".execution-step-row",

        { opacity: 0, x: -8 },

        {

          opacity: 1,

          x: 0,

          duration: 0.35,

          stagger: 0.035,

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

        { opacity: 0.65, y: 5 },

        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },

      );

    }, details);

    return () => ctx.revert();

  }, [stepIndex, currentStep]);

  return (

    <section

      ref={rootRef}

      className="overflow-hidden rounded-2xl border border-[#e1e6dc] bg-white text-[#19271e] shadow-[0_14px_40px_rgba(33,55,33,0.055)]"

    >

      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e9df] px-5 py-5 sm:px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5e4c7] bg-[#eff5e6] text-[#60813b]">

            <ListOrdered size={20} />

          </div>

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60813b]">

              Execution trace

            </p>

            <h3 className="mt-1 text-lg font-semibold text-[#203725]">

              Execution Steps

            </h3>

          </div>

        </div>

        <span className="rounded-full border border-[#e1e6dc] bg-[#f8faf5] px-3 py-1.5 font-mono text-xs text-[#465947]">

          {steps.length > 0 ? stepIndex + 1 : 0}

          <span className="px-1.5 text-[#929b8e]">/</span>

          {steps.length}

        </span>

      </div>

      <div className="grid min-w-0 xl:grid-cols-[1.05fr_0.95fr]">

        {/* Step list */}

        <div className="min-w-0 border-b border-[#e5e9df] p-4 sm:p-5 xl:border-b-0 xl:border-r">

          <div className="mb-4 flex items-center justify-between gap-3">

            <h4 className="text-xs font-semibold text-[#465947]">

              Algorithm timeline

            </h4>

            <span className="text-[10px] text-[#7e8979]">

              Select a step to inspect

            </span>

          </div>

          <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1 [scrollbar-color:#334155_transparent] [scrollbar-width:thin]">

            {steps.map((step, index) => {

              const active = index === stepIndex;

              const completed = index < stepIndex;

              return (

                <button

                  type="button"

                  key={step.id}

                  className={`execution-step-row group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors duration-200 sm:p-4 ${

                    active

                      ? "border-[#cadcba] bg-[#edf4e5]"

                      : "border-[#edf0e9] bg-[#fcfdf9] hover:border-[#dce3d6] hover:bg-[#f4f7ef]"

                  }`}

                  aria-current={active ? "step" : undefined}

                  onClick={() => onSelectStep(index)}

                >

                  <span

                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${

                      active

                        ? "border-[#c4d8b0] bg-[#edf4e5] text-[#496b36]"

                        : completed

                          ? "border-[#dce8d1] bg-[#f1f7ed] text-[#56823d]"

                          : "border-[#e1e6dc] bg-[#f8faf5] text-[#7e8979]"

                    }`}

                  >

                    {completed ? (

                      <CheckCircle2 size={16} />

                    ) : active ? (

                      <CircleDot size={17} />

                    ) : (

                      index + 1

                    )}

                  </span>

                  <span className="min-w-0 flex-1">

                    <span className="flex flex-wrap items-center gap-2">

                      <span

                        className={`text-sm font-medium leading-5 ${

                          active ? "text-[#496b36]" : "text-[#465947]"

                        }`}

                      >

                        {step.description}

                      </span>

                      {active && (

                        <span className="rounded-md border border-[#d5e4c7] bg-[#edf4e5] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#60813b]">

                          Active

                        </span>

                      )}

                    </span>

                    <span className="mt-1.5 block truncate text-xs text-[#7e8979]">

                      {step.action}

                    </span>

                  </span>

                </button>

              );

            })}

            {steps.length === 0 && (

              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e1e6dc] px-4 py-10 text-center">

                <Waypoints size={25} className="mb-3 text-[#929b8e]" />

                <p className="text-sm font-medium text-[#465947]">

                  No execution steps yet

                </p>

                <p className="mt-2 max-w-xs text-xs leading-5 text-[#7e8979]">

                  Load a graph and run an algorithm to populate the execution

                  timeline.

                </p>

              </div>

            )}

          </div>

        </div>

        {/* Details panel */}

        <div ref={detailsRef} className="min-w-0 p-4 sm:p-5">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7e5d4] bg-[#f3f2e7] text-[#7a8051]">

              <Activity size={19} />

            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8051]">

                Step inspector

              </p>

              <h4 className="mt-1 font-semibold text-[#203725]">

                Current Step Details

              </h4>

            </div>

          </div>

          {currentStep ? (

            <div className="space-y-3">

              <div className="rounded-xl border border-[#dce8d1] bg-[#f3f7ee] p-4">

                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#60813b]">

                  Action

                </p>

                <p className="text-sm font-medium leading-6 text-[#19271e]">

                  {currentStep.action}

                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-[#e5e9df] bg-[#f8faf5] p-4">

                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#7e8979]">

                    Current node

                  </p>

                  <p className="mt-2 break-words font-mono text-base font-semibold text-[#496b36]">

                    {currentStep.node || "—"}

                  </p>

                </div>

                <div className="rounded-xl border border-[#e5e9df] bg-[#f8faf5] p-4">

                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#7e8979]">

                    Distance

                  </p>

                  <p className="mt-2 break-words font-mono text-base font-semibold text-[#6d7348]">

                    {currentStep.distance ?? "—"}

                  </p>

                </div>

              </div>

              <div className="rounded-xl border border-[#e5e9df] bg-[#f7f8f2] p-4">

                <div className="mb-2 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />

                  <p className="text-xs font-semibold text-[#2f4332]">

                    Why this step matters

                  </p>

                </div>

                <p className="text-sm leading-6 text-[#6f7c6c]">

                  {currentStep.reason}

                </p>

              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[#e5e9df] pt-4">

                <span className="text-xs text-[#7e8979]">

                  Step identifier

                </span>

                <span className="max-w-[60%] truncate rounded-md border border-[#e1e6dc] bg-[#f8faf5] px-2 py-1 font-mono text-xs text-[#465947]">

                  {currentStep.id}

                </span>

              </div>

            </div>

          ) : (

            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#e1e6dc] px-4 text-center">

              <Activity size={24} className="mb-3 text-[#929b8e]" />

              <p className="text-sm font-medium text-[#465947]">

                No step selected

              </p>

              <p className="mt-2 max-w-xs text-xs leading-5 text-[#7e8979]">

                Select an execution step from the timeline to inspect its

                action, node, distance, and reasoning.

              </p>

            </div>

          )}

        </div>

      </div>

    </section>

  );

}