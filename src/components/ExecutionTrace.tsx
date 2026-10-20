import type { GraphStep } from "../types";

interface Props {
  steps: GraphStep[];
  currentStep: number;
  onSelectStep?: (index: number) => void;
}

export default function ExecutionTrace({
  steps,
  currentStep,
  onSelectStep,
}: Props) {
  if (steps.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Execution trace
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Run an algorithm to see its execution steps.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Execution trace
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {steps.length} steps
        </p>
      </div>

      <ol className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto">
        {steps.map((step, index) => {
          const active = index === currentStep;

          return (
            <li key={`${step.stepNumber}-${index}`}>
              <button
                type="button"
                onClick={() => onSelectStep?.(index)}
                disabled={!onSelectStep}
                aria-current={active ? "step" : undefined}
                className={`w-full px-4 py-3 text-left transition ${
                  active
                    ? "bg-emerald-50"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      active
                        ? "bg-emerald-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {step.stepNumber}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {step.message}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {step.explanation}
                    </p>

                    {step.currentNode && (
                      <p className="mt-1 text-xs text-emerald-700">
                        Current node: {step.currentNode}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-600">
                    {step.action}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}