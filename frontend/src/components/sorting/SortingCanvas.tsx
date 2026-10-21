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
  const maxAbs = Math.max(1, ...values.map(Math.abs));

  const active = new Set(step?.activeIndices ?? []);
  const sorted = new Set(step?.sortedIndices ?? []);

  const isComplete = step?.action === "complete";
  const isInsertion = step?.action === "insert" || step?.action === "shift";
  const isShift = step?.action === "shift";
  const isSwap = step?.action === "swap" || step?.swapped === true;

  const barWidth =
    values.length <= 8
      ? "min-w-[48px] max-w-[76px]"
      : values.length <= 16
        ? "min-w-[36px] max-w-[56px]"
        : values.length <= 32
          ? "min-w-[28px] max-w-[40px]"
          : "min-w-[24px] max-w-[32px]";

  const gapClass =
    values.length <= 8
      ? "gap-3"
      : values.length <= 16
        ? "gap-2"
        : "gap-1";

  return (
    <div className="w-full" aria-label="Sorting array visualization">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#31482e]">
            Array visualization
          </p>
          <p className="mt-1 text-xs text-[#778176]">
            {step
              ? `Step ${step.stepNumber}: ${step.explanation}`
              : "Ready to execute"}
          </p>
        </div>

        <span className="rounded-full border border-[#d5dfcc] bg-[#f2f6ec] px-3 py-1 text-xs text-[#4e604d]">
          {values.length} elements
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#e1e8d9] bg-[#f8faf5] p-3 sm:p-5">
        <div
          className={`flex min-h-[270px] items-end justify-center pb-2 pt-8 ${gapClass} ${
            values.length > 16 ? "min-w-max" : "w-full"
          }`}
        >
          {values.map((value, index) => {
            const isKey = step?.keyIndex === index;
            const isPivot = step?.pivotIndex === index;
            const isMinimum = step?.minIndex === index;
            const isActive = active.has(index);
            const isSorted = sorted.has(index) || isComplete;
            const isCompared = isActive && !isKey && !isPivot;

            let color =
              "border-[#cbd6c2] bg-[#dfe7d7] text-[#203626]";

            let label = "Unprocessed";

            if (isSorted) {
              color =
                "border-[#8fb568] bg-[#c4e58c] text-[#203626]";
              label = "Sorted";
            }

            if (isMinimum) {
              color =
                "border-[#d69a4f] bg-[#f4c477] text-[#432e18]";
              label = "Minimum candidate";
            }

            if (isCompared) {
              color =
                "border-[#5b9cba] bg-[#a9d7e9] text-[#173b4b]";
              label = "Comparing";
            }

            if (isShift) {
              if (isActive) {
                color =
                  "border-[#cf8b61] bg-[#f1b58d] text-[#542b19]";
                label = "Shifted";
              }
            }

            if (isSwap && isActive) {
              color =
                "border-[#d97783] bg-[#f5b5bd] text-[#5e1e2b]";
              label = "Swapped";
            }

            if (isKey) {
              color =
                "border-[#9a78c4] bg-[#d9c5f5] text-[#392254]";
              label = "Insertion key";
            }

            if (isPivot) {
              color =
                "border-[#9a78c4] bg-[#d9c5f5] text-[#392254]";
              label = "Pivot";
            }

            const height = Math.max(
              54,
              (Math.abs(value) / maxAbs) * 190,
            );

            return (
              <div
                key={`${index}-${value}`}
                className={`flex shrink-0 flex-col items-center ${barWidth}`}
                title={`Index ${index}, value ${value}: ${label}`}
              >
                <div className="mb-2 flex min-h-7 items-center justify-center">
                  {(isKey || isPivot || isActive || isMinimum) && (
                    <span className="rounded-md bg-[#203626] px-1.5 py-1 text-[10px] font-bold text-white">
                      {isKey
                        ? "KEY"
                        : isPivot
                          ? "PIVOT"
                          : isMinimum
                            ? "MIN"
                            : isShift
                              ? "SHIFT"
                              : isSwap
                                ? "SWAP"
                                : "COMPARE"}
                    </span>
                  )}
                </div>

                <div
                  className={`flex w-full items-center justify-center rounded-t-lg border-2 font-bold tabular-nums transition-all duration-300 ${color} ${
                    isKey || isPivot
                      ? "ring-2 ring-[#b9a0dd]/50 ring-offset-2"
                      : ""
                  }`}
                  style={{ height: `${height}px` }}
                >
                  <span
                    className={`select-none ${
                      values.length > 24
                        ? "text-xs"
                        : values.length > 12
                          ? "text-sm"
                          : "text-base sm:text-lg"
                    }`}
                  >
                    {value}
                  </span>
                </div>

                <span className="mt-2 text-[11px] font-medium tabular-nums text-[#778176]">
                  {index}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#65725f]">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#dfe7d7]" />
          Unprocessed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#a9d7e9]" />
          Comparing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#d9c5f5]" />
          Key / Pivot
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#f1b58d]" />
          Shifted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[#c4e58c]" />
          Sorted
        </span>
      </div>
    </div>
  );
}