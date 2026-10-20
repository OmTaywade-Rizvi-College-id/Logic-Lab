import type { SortingAlgorithmId, SortingResult, SortingStep } from "../types";

interface SortingWorkspaceProps {
  algorithm: SortingAlgorithmId;
  result: SortingResult | null;
  stepIndex: number;
  onSelectStep: (index: number) => void;
}

const algorithmLabels: Record<SortingAlgorithmId, string> = {
  selectionSort: "Selection Sort",
  insertionSort: "Insertion Sort",
  quickSort: "Quick Sort",
};

export default function SortingWorkspace({
  algorithm,
  result,
  stepIndex,
  onSelectStep,
}: SortingWorkspaceProps) {
  if (!result) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-800">
          Sorting visualization
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Select values and run {algorithmLabels[algorithm]} to view its execution.
        </p>
      </section>
    );
  }

  const step: SortingStep | undefined = result.steps[stepIndex];
  const values = step?.array ?? result.originalArray;
  const maxValue = Math.max(1, ...values.map((value) => Math.abs(value)));

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">
          Sorting visualization
        </h2>
        <span className="text-xs text-slate-500">
          {algorithmLabels[result.algorithm]}
        </span>
      </div>

      <div className="flex min-h-36 flex-wrap items-end justify-center gap-2 rounded-lg bg-slate-50 p-4">
        {values.map((value, index) => {
          const active = step?.activeIndices.includes(index) ?? false;
          const sorted = step?.sortedIndices.includes(index) ?? false;
          const height = Math.max(
            24,
            (Math.abs(value) / maxValue) * 120,
          );

          return (
            <button
              key={`${index}-${value}`}
              type="button"
              onClick={() => onSelectStep(stepIndex)}
              title={`Index ${index}: ${value}`}
              className={`flex min-w-8 flex-col items-center justify-end rounded-t-md px-2 py-1 text-xs font-medium ${
                active
                  ? "bg-amber-400 text-slate-900"
                  : sorted
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-800"
              }`}
              style={{ height }}
            >
              {value}
            </button>
          );
        })}
      </div>

      {step && (
        <p className="text-sm text-slate-600">{step.explanation}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span>Comparisons: {step?.comparisons ?? result.comparisons}</span>
        <span>Swaps: {step?.swaps ?? result.swaps}</span>
        <span>Writes: {step?.writes ?? result.writes}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {result.steps.map((item, index) => (
          <button
            key={item.stepNumber}
            type="button"
            onClick={() => onSelectStep(index)}
            aria-current={index === stepIndex ? "step" : undefined}
            className={`rounded-md px-2 py-1 text-xs ${
              index === stepIndex
                ? "bg-emerald-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item.stepNumber}
          </button>
        ))}
      </div>
    </section>
  );
}