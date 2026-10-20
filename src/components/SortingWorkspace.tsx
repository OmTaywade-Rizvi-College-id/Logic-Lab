

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

    description: "Find the next minimum or maximum and place it in its final position.",

    complexity: "O(n²)",

    space: "O(1)",

  },

  insertionSort: {

    title: "Insertion Sort",

    description: "Insert each value into its correct position in the sorted section.",

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
    "array" in controller.playback.currentStep ? controller.playback.currentStep: null
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
    <div className="mx-auto w-full max-w-[1500px] space-y-3">
      {/* Algorithm information and primary controls */}

      <section className="overflow-hidden rounded-[26px] border border-[#e2e7dc] bg-white text-[#19271e] shadow-[0_12px_38px_rgba(29,49,29,0.055)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6ebe1] px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[#203626]">
                {details.title}
              </h2>

              <span className="rounded-full border border-[#d6e4c6] bg-[#edf4e3] px-2 py-0.5 text-[10px] font-bold text-[#55783b]">
                SORTING
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#778176]">
              {details.description}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="text-[#899383]">
                Average time{" "}
                <strong className="text-[#4e604d]">
                  {details.complexity}
                </strong>
              </span>
              <span className="text-[#899383]">
                Space{" "}
                <strong className="text-[#4e604d]">
                  {details.space}
                </strong>
              </span>
            </div>
          </div>

          {/* Keep these controls together at every screen size */}

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="submit"
              form="sorting-input-form"
              disabled={controller.busy}
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#203626] px-3 py-2 text-xs font-bold text-[#e6f6c9] transition hover:bg-[#2e4a33] disabled:opacity-40"
            >
              <Play size={14} fill="currentColor" />
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
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#dfe5d8] bg-white px-3 py-2 text-xs font-semibold text-[#4e604d] transition hover:bg-[#f5f8ef] disabled:opacity-40"
            >
              {isPlaying ? (
                <Pause size={14} />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              type="button"
              title="Reset playback"
              aria-label="Reset playback"
              disabled={!sortingResult || controller.busy}
              onClick={resetExecution}
              className="inline-flex items-center justify-center rounded-xl border border-[#dfe5d8] bg-white px-2.5 py-2 text-[#4e604d] transition hover:bg-[#f5f8ef] disabled:opacity-40"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4">
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
          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
        >
          {controller.error}
        </div>
      )}

      {/* Visualization updates in place as playback advances */}

      <section className="overflow-hidden rounded-[26px] border border-[#e2e7dc] bg-white text-[#19271e] shadow-[0_12px_38px_rgba(29,49,29,0.055)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6ebe1] px-4 py-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-[#203626]">
              Live sorting visualization
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#778176]"
              aria-live="polite"
            >
              {step?.explanation ??
                "Enter your array and select Run to generate the execution steps."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-[11px]">
            <span className="rounded-md border border-[#dfe5d8] bg-[#f7f9f3] px-2 py-1 text-[#4e604d]">
              {values.length} values
            </span>
            <span className="rounded-md border border-[#d6e4c6] bg-[#edf4e3] px-2 py-1 text-[#55783b]">
              {sortingResult ? `${totalSteps} steps` : "Ready"}
            </span>
          </div>
        </div>

        <div className="space-y-3 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#778176]">
            <Legend color="bg-[#8daf5a]" label="Sorted" />
            <Legend color="bg-amber-400" label="Comparing" />
            <Legend color="bg-rose-500" label="Swap" />
            <Legend color="bg-violet-400" label="Pivot / key" />
            <Legend color="bg-orange-400" label="Minimum" />
            <Legend color="bg-slate-400" label="Unprocessed" />
          </div>

          <div className="overflow-hidden rounded-xl border border-[#e6ebe1] bg-[#203626] p-2 sm:p-3">
            <SortingCanvas values={values} step={step} />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

            <Stat
              label="Comparisons"
              value={step?.comparisons ?? 0}
              accent="text-amber-300"
            />

            <Stat
              label="Swaps"
              value={step?.swaps ?? 0}
              accent="text-rose-300"
            />

            <Stat
              label="Writes"
              value={step?.writes ?? 0}
              accent="text-sky-300"
            />

            <Stat
              label="Direction"
              value={ascending ? "Ascending" : "Descending"}
              accent="text-[#55783b]"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="text-[#778176]">Execution progress</span>
              <span className="font-mono text-[#55783b]">{progress}%</span>
            </div>

            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#e4e9df]"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Sorting execution progress"
            >
              <div className="h-full rounded-full bg-gradient-to-r from-[#638640] to-[#b2d66f] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step navigation; Play/Pause remains in the header */}
          <div className="flex flex-wrap items-center gap-2 border-t border-[#e6ebe1] pt-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfe5d8] bg-white px-3 py-2 text-xs font-semibold text-[#4e604d] transition hover:bg-[#f5f8ef] disabled:opacity-40"
              disabled={!sortingResult || controller.playback.isFirst}
              onClick={controller.playback.previous}
            >
              <SkipBack size={13} />
              Previous
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfe5d8] bg-white px-3 py-2 text-xs font-semibold text-[#4e604d] transition hover:bg-[#f5f8ef] disabled:opacity-40"
              disabled={!sortingResult || controller.playback.isLast}
              onClick={controller.playback.next}
            >
              Next
              <SkipForward size={13} />
            </button>

            <label className="ml-auto flex items-center gap-2 text-xs text-[#778176]">
              Speed
              <select
                value={controller.playback.speed}
                onChange={(event) =>
                  controller.playback.setSpeed(Number(event.target.value))
                }
                className="w-[76px] rounded-lg border border-[#dfe5d8] bg-white px-2 py-2 text-xs text-[#344936] outline-none focus:border-[#9db783]"
              >
                <option value={0.5}>0.5×</option>
                <option value={1}>1×</option>
                <option value={2}>2×</option>
                <option value={4}>4×</option>
              </select>
            </label>
          </div>

          <div className="rounded-lg border border-[#e6ebe1] bg-[#f7f9f3] px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-[#778176]">Step position</span>
              <span className="font-mono text-[#4e604d]">
                {sortingResult ? stepIndex + 1 : 0} / {totalSteps}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(0, totalSteps - 1)}
              value={stepIndex}
              disabled={!sortingResult}
              onChange={(event) =>
                controller.playback.seek(Number(event.target.value))
              }
              className="w-full cursor-pointer accent-[#638640]"
              aria-label="Choose sorting step"
            />

          </div>

          {sortingResult && (
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-[#dce8cd] bg-[#f3f7ec] px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#899383]">
                  Final sorted array
                </p>

                <p className="mt-1 break-words font-mono text-sm text-[#55783b]">
                  [{sortingResult.sortedArray.join(", ")}]
                </p>
              </div>
              {isComplete && (
                <span className="rounded-md bg-[#edf4e3] px-2 py-1 text-[11px] font-medium text-[#55783b]">
                  Complete
                </span>
              )}
            </div>
          )}
        </div>
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

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[#e6ebe1] bg-[#f7f9f3] px-3 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wider text-[#899383]">
        {label}
      </p>
      <p className={`mt-1 truncate text-sm font-bold ${accent}`}>{value}</p>
    </div>
  );
}