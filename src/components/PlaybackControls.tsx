import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Settings2,
} from "lucide-react";

interface Props {
  stepIndex: number;
  totalSteps: number;
  speed: number;
  repeats: number;
  playing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSpeed: (speed: number) => void;
  onRepeats: (repeats: number) => void;
  onTogglePlay: () => void;
  onReset?: () => void;
  onToggleEditor?: () => void;
  editorOpen?: boolean;
  disabled?: boolean;
}

export default function PlaybackControls({
  stepIndex,
  totalSteps,
  speed,
  repeats,
  playing,
  onPrevious,
  onNext,
  onSpeed,
  onRepeats,
  onTogglePlay,
  onReset,
  onToggleEditor,
  editorOpen = false,
  disabled = false,
}: Props) {
  const hasSteps = totalSteps > 0;

  return (
    <section className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          disabled={disabled || !hasSteps}
          aria-label="Reset playback"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <RotateCcw size={16} />
        </button>
      )}

      <button
        type="button"
        onClick={onPrevious}
        disabled={disabled || !hasSteps || stepIndex <= 0}
        aria-label="Previous step"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={onTogglePlay}
        disabled={disabled || !hasSteps}
        className="inline-flex items-center gap-2 rounded-lg bg-[#203626] px-4 py-2 text-sm font-medium text-white hover:bg-[#365b35] disabled:opacity-40"
      >
        {playing ? <Pause size={15} /> : <Play size={15} />}
        {playing ? "Pause" : "Play"}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={disabled || !hasSteps || stepIndex >= totalSteps - 1}
        aria-label="Next step"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>

      <label className="flex items-center gap-2 text-xs text-slate-600">
        Speed
        <select
          value={speed}
          onChange={(event) => onSpeed(Number(event.target.value))}
          disabled={disabled}
          className="rounded-md border border-slate-200 bg-white px-2 py-1.5"
        >
          <option value={1500}>0.5×</option>
          <option value={1000}>0.75×</option>
          <option value={700}>1×</option>
          <option value={400}>1.5×</option>
          <option value={200}>2×</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-600">
        Repeats
        <select
          value={repeats}
          onChange={(event) => onRepeats(Number(event.target.value))}
          disabled={disabled}
          className="rounded-md border border-slate-200 bg-white px-2 py-1.5"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
      </label>

      {onToggleEditor && (
        <button
          type="button"
          onClick={onToggleEditor}
          aria-pressed={editorOpen}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs ${
            editorOpen
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Settings2 size={14} />
          {editorOpen ? "Hide editor" : "Edit graph"}
        </button>
      )}

      <span className="ml-auto text-xs tabular-nums text-slate-500">
        {hasSteps ? stepIndex + 1 : 0} / {totalSteps}
      </span>
    </section>
  );
}