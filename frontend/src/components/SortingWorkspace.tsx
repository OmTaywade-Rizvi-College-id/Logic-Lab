import { useMemo, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";

import type { SortingAlgorithmId, SortingStep } from "../types";
import { useAlgorithmController } from "../hooks/useAlgorithmController";
import SortingInputs from "./SortingInputs";
import SortingCanvas from "./sorting/SortingCanvas";
import SortingSourcePanel from "./source/SortingSourcePanel";

interface SortingWorkspaceProps {
  algorithm: SortingAlgorithmId;
}

const ALGORITHM_DETAILS: Record<
  SortingAlgorithmId,
  { title: string; description: string; complexity: string; space: string }
> = {
  selectionSort: {
    title: "Selection Sort",
    description:
      "Find the next minimum or maximum and place it in its final position.",
    complexity: "O(n²)",
    space: "O(1)",
  },
  insertionSort: {
    title: "Insertion Sort",
    description:
      "Insert each value into its correct position in the sorted section.",
    complexity: "O(n²)",
    space: "O(1)",
  },
  quickSort: {
    title: "Quick Sort",
    description: "Partition values around a pivot and sort each partition.",
    complexity: "O(n log n) average",
    space: "O(log n) average",
  },
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9db783] focus-visible:ring-offset-2";
const focusRingDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b7d66e]/70";

const thumb =
  "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#203626] [&::-webkit-slider-thumb]:bg-[#e6f6c9] " +
  "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#203626] [&::-moz-range-thumb]:bg-[#e6f6c9]";

export default function SortingWorkspace({
  algorithm,
}: SortingWorkspaceProps) {
  const controller = useAlgorithmController({ algorithm });
  const [inputValues, setInputValues] = useState<number[]>([
    8, 3, 5, 1, 9, 2,
  ]);
  const [ascending, setAscending] = useState(true);
  const [hasRun, setHasRun] = useState(false);
  const details = ALGORITHM_DETAILS[algorithm];
  const result = controller.result;
  const sortingResult = result && "sortedArray" in result ? result : null;
  const step = (
    controller.playback.currentStep &&
    "array" in controller.playback.currentStep
      ? controller.playback.currentStep
      : null
  ) as SortingStep | null;

  const values = step?.array ?? inputValues;
  const totalSteps = controller.playback.totalSteps;
  const stepIndex = controller.playback.stepIndex;
  const isPlaying = controller.playback.playing;
  const isComplete = Boolean(sortingResult) && controller.playback.isLast;
  const progress = useMemo(() => {
    if (!sortingResult || totalSteps <= 1) {
      return sortingResult && totalSteps === 1 ? 100 : 0;
    }

    return Math.round((stepIndex / (totalSteps - 1)) * 100);
  }, [sortingResult, stepIndex, totalSteps]);

  function run(valuesFromInput: number[], order: boolean) {
    setInputValues(valuesFromInput);
    setAscending(order);
    setHasRun(true);
    // Execute locally. Do not scroll or move focus to the visualization.
    controller.runSorting(valuesFromInput, order);
  }

  function resetExecution() {
    controller.playback.pause();
    controller.playback.reset();
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-4">
      {/* Algorithm information, primary controls and input */}
      <section className="overflow-hidden rounded-2xl border border-[#e2e7dc] bg-white text-[#19271e]">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1 basis-72">
            <h2 className="text-xl font-semibold tracking-tight text-[#203626] sm:text-2xl">
              {details.title}
            </h2>

            <p className="mt-1 max-w-prose text-sm leading-6 text-[#5f6c5e]">
              {details.description}
            </p>

            <dl className="mt-3 flex flex-wrap gap-2 text-xs">
              <div className="inline-flex items-baseline gap-1.5 rounded-full bg-[#f1f5ea] px-3 py-1">
                <dt className="text-[#6b7a68]">Time</dt>
                <dd className="font-mono font-semibold text-[#2f4a31]">
                  {details.complexity}
                </dd>
              </div>
              <div className="inline-flex items-baseline gap-1.5 rounded-full bg-[#f1f5ea] px-3 py-1">
                <dt className="text-[#6b7a68]">Space</dt>
                <dd className="font-mono font-semibold text-[#2f4a31]">
                  {details.space}
                </dd>
              </div>
            </dl>
          </div>

          {/* Keep these controls together at every screen size */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="submit"
              form="sorting-input-form"
              disabled={controller.busy}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#203626] px-4 py-2.5 text-sm font-semibold text-[#e6f6c9] transition hover:bg-[#2e4a33] disabled:opacity-40 ${focusRing}`}
            >
              <Play size={15} fill="currentColor" />
              {controller.busy ? "Running…" : "Run"}
            </button>

            <button
              type="button"
              disabled={!hasRun || !sortingResult || controller.busy}
              onClick={() => {
                if (isPlaying) {
                  controller.playback.pause();
                } else if (controller.playback.isLast) {
                  controller.playback.reset();
                  controller.playback.play();
                } else {
                  controller.playback.play();
                }
              }}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#d5ddcb] bg-white px-4 py-2.5 text-sm font-semibold text-[#344936] transition hover:bg-[#f5f8ef] disabled:opacity-40 ${focusRing}`}
            >
              {isPlaying ? (
                <Pause size={15} />
              ) : (
                <Play size={15} fill="currentColor" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              type="button"
              title="Reset playback"
              aria-label="Reset playback"
              disabled={!sortingResult || controller.busy}
              onClick={resetExecution}
              className={`inline-flex items-center justify-center rounded-xl border border-[#d5ddcb] bg-white p-2.5 text-[#344936] transition hover:bg-[#f5f8ef] disabled:opacity-40 ${focusRing}`}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="border-t border-[#e6ebe1] bg-[#f7f9f3] p-4 sm:px-6">
          <SortingInputs
            onRun={run}
            busy={controller.busy}
            initialValues={inputValues}
            initialAscending={ascending}
          />
        </div>
      </section>

      {controller.error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {controller.error}
        </div>
      )}

      {/* Visualization stage: updates in place as playback advances */}
      <section
        aria-label="Sorting visualization"
        className="overflow-hidden rounded-2xl border border-[#2b4631] bg-[#203626] text-[#e6f6c9]"
      >
        {/* What is happening right now */}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 px-5 pb-3 pt-4 sm:px-6">
          <p
            className="min-h-[3rem] min-w-0 flex-1 basis-72 text-base leading-6 text-white/90"
            aria-live="polite"
          >
            {step?.explanation ??
              "Enter your array and select Run to generate the execution steps."}
          </p>

          <p className="shrink-0 pt-0.5 font-mono text-xs tabular-nums text-white/55">
            {values.length} values
            <span className="ml-3 text-[#b7d66e]">
              {sortingResult ? `${totalSteps} steps` : "Ready"}
            </span>
          </p>
        </div>

        <div className="px-3 sm:px-5">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#14251a] p-2 sm:p-3">
            <SortingCanvas values={values} step={step} />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 py-3 text-xs text-white/65">
            <Legend color="bg-[#8daf5a]" label="Sorted" />
            <Legend color="bg-amber-400" label="Comparing" />
            <Legend color="bg-rose-500" label="Swap" />
            <Legend color="bg-violet-400" label="Pivot / key" />
            <Legend color="bg-orange-400" label="Minimum" />
            <Legend color="bg-slate-400" label="Unprocessed" />
          </div>
        </div>

        {/* Live counters */}
        <dl className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 sm:grid-cols-4">
          <Readout
            label="Comparisons"
            value={step?.comparisons ?? 0}
            accent="text-amber-300"
          />
          <Readout
            label="Swaps"
            value={step?.swaps ?? 0}
            accent="text-rose-300"
          />
          <Readout
            label="Writes"
            value={step?.writes ?? 0}
            accent="text-sky-300"
          />
          <Readout
            label="Direction"
            value={ascending ? "Ascending" : "Descending"}
            accent="text-[#d9f99d]"
            text
          />
        </dl>

        {/* Transport: step through, scrub, change speed. Play/Pause lives in the header. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-white/10 bg-black/15 px-4 py-3 sm:px-6">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-[#e6f6c9] transition hover:bg-white/10 disabled:opacity-35 ${focusRingDark}`}
            disabled={!sortingResult || controller.playback.isFirst}
            onClick={controller.playback.previous}
          >
            <SkipBack size={13} />
            Previous
          </button>

          <button
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-[#e6f6c9] transition hover:bg-white/10 disabled:opacity-35 ${focusRingDark}`}
            disabled={!sortingResult || controller.playback.isLast}
            onClick={controller.playback.next}
          >
            Next
            <SkipForward size={13} />
          </button>

          <div className="order-last flex w-full min-w-0 items-center gap-3 sm:order-none sm:w-auto sm:flex-1">
            <input
              type="range"
              min={0}
              max={Math.max(0, totalSteps - 1)}
              value={stepIndex}
              disabled={!sortingResult}
              onChange={(event) =>
                controller.playback.seek(Number(event.target.value))
              }
              style={{
                background: `linear-gradient(to right, #b7d66e ${progress}%, rgba(255,255,255,0.16) ${progress}%)`,
              }}
              className={`h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-40 ${thumb} ${focusRingDark}`}
              aria-label="Choose sorting step"
              aria-valuetext={`Step ${sortingResult ? stepIndex + 1 : 0} of ${totalSteps}, ${progress}% complete`}
            />

            <span className="shrink-0 text-right font-mono text-xs tabular-nums text-white/70">
              {sortingResult ? stepIndex + 1 : 0} / {totalSteps}
            </span>
          </div>

          <label className="ml-auto flex items-center gap-2 text-xs text-white/65 sm:ml-0">
            Speed
            <select
              value={controller.playback.speed}
              onChange={(event) =>
                controller.playback.setSpeed(Number(event.target.value))
              }
              className={`rounded-lg border border-white/15 bg-[#14251a] px-2 py-1.5 text-xs text-[#e6f6c9] ${focusRingDark}`}
            >
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
              <option value={4}>4×</option>
            </select>
          </label>
        </div>

        {sortingResult && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs text-white/55">Final sorted array</p>
              <p className="mt-0.5 break-words font-mono text-sm text-[#d9f99d]">
                [{sortingResult.sortedArray.join(", ")}]
              </p>
            </div>

            {isComplete && (
              <span className="rounded-full bg-[#b7d66e]/15 px-3 py-1 text-xs font-semibold text-[#d9f99d]">
                Complete
              </span>
            )}
          </div>
        )}
      </section>

      <SortingSourcePanel algorithm={algorithm} step={step} />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

function Readout({
  label,
  value,
  accent,
  text = false,
}: {
  label: string;
  value: string | number;
  accent: string;
  text?: boolean;
}) {
  return (
    <div className="min-w-0 px-5 py-3 sm:px-6">
      <dt className="text-xs text-white/55">{label}</dt>
      <dd
        className={`mt-0.5 truncate font-semibold tabular-nums ${accent} ${
          text ? "text-base leading-8" : "font-mono text-2xl"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}