import type { SortingStep } from "../../types";

interface SortingCanvasProps {
  values: number[];
  step?: SortingStep | null;
}

export default function SortingCanvas({
  values,
  step,
}: SortingCanvasProps) {
  if (values.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[#cbd6c2] bg-[#f8faf5] text-sm text-[#73836d]">
        Enter numbers and run an algorithm to see the visualization.
      </div>
    );
  }

  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const range = Math.max(1, max - min);

  const active = new Set(step?.activeIndices ?? []);
  const sorted = new Set(step?.sortedIndices ?? []);

  const isSwapStep =
    step?.action === "swap" || step?.swapped === true;

  const isComplete = step?.action === "complete";

  // Keep small arrays centered; allow larger arrays to scroll horizontally.
  const barWidth =
    values.length <= 8
      ? "min-w-[44px] max-w-[76px]"
      : values.length <= 16
        ? "min-w-[30px] max-w-[52px]"
        : values.length <= 32
          ? "min-w-[22px] max-w-[36px]"
          : "min-w-[18px] max-w-[26px]";

  const gapClass =
    values.length <= 8
      ? "gap-3"
      : values.length <= 16
        ? "gap-2"
        : "gap-1";

  return (
    <div
      className="w-full"
      aria-label="Sorting array visualization"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-[#31482e]">
            Array visualization
          </p>
          <p className="mt-1 text-[11px] text-[#879381]">
            {step
              ? `Step ${step.stepNumber + 1}: ${step.explanation}`
              : "Ready to execute"}
          </p>
        </div>

        <span className="rounded-md border border-[#d5dfcc] bg-[#f2f6ec] px-2 py-1 text-[10px] text-[#6b7b62]">
          {values.length} elements
        </span>
      </div>

      <div className="flex min-h-[200px] items-end justify-center overflow-x-auto border-b border-[#dce4d5] pb-2">
        <div
          className={`flex w-full items-end justify-center ${gapClass} ${
            values.length > 20 ? "min-w-max" : ""
          }`}
        >
          {values.map((value, index) => {
            const isPivot = step?.pivotIndex === index;
            const isKey = step?.keyIndex === index;
            const isMinimum = step?.minIndex === index;
            const isActive = active.has(index);
            const isSorted = sorted.has(index) || isComplete;

            let color =
              "bg-[#e4eadd] text-[#2c4030] border-[#cbd6c2]";

            let label = "Unprocessed";

            if (isSorted) {
              color =
                "bg-[#c4e58c] text-[#203626] border-[#a9ca78]";
              label = "Sorted";
            }

            if (isActive) {
              color =
                "bg-[#f0d582] text-[#3e351c] border-[#d9bd62]";
              label = "Comparing";
            }

            if (isSwapStep && (isActive || index === step?.indexI || index === step?.indexJ)) {
              color =
                "bg-[#e5a08a] text-[#40251e] border-[#ce8068]";
              label = "Swap";
            }

            if (isMinimum) {
              color =
                "bg-[#e7b873] text-[#432e18] border-[#d69a4f]";
              label = "Minimum candidate";
            }

            if (isPivot || isKey) {
              color =
                "bg-[#a7bd8b] text-[#203626] border-[#839e68]";
              label = isPivot ? "Pivot" : "Insertion key";
            }

            const barHeight = Math.max(
              10,
              Math.abs(value) === 0
                ? 10
                : (Math.abs(value) / range) * 150,
            );

            return (
              <div
                key={`${index}-${value}`}
                className={`flex shrink-0 flex-col items-center ${barWidth}`}
                title={`Index ${index}, value ${value}, ${label}`}
              >
                <span className="mb-1 text-[11px] font-semibold tabular-nums text-[#31482e]">
                  {value}
                </span>

                <div
                  className={`w-full rounded-t-md border transition-[height,background-color] duration-300 ease-out ${color} ${
                    isPivot || isKey
                      ? "shadow-[0_0_12px_rgba(131,158,104,0.22)]"
                      : isActive
                        ? "shadow-[0_0_10px_rgba(217,189,98,0.20)]"
                        : ""
                  }`}
                  style={{ height: `${barHeight}px` }}
                />

                <span className="mt-1.5 text-[10px] tabular-nums text-[#879381]">
                  {index}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#879381]">
        <span>Index labels appear below each bar.</span>
        <span>
          {step ? `Operation: ${step.action}` : "No active operation"}
        </span>
      </div>
    </div>
  );
}