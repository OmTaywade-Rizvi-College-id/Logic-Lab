import { useEffect, useRef } from "react";
import {
  FastForward,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import gsap from "gsap";
import SectionCard from "./SectionCard";

type Props = {
  stepIndex: number;
  totalSteps: number;
  speed: number;
  repeats: number;
  playing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onSpeed: (value: number) => void;
  onRepeats: (value: number) => void;
  onToggleEditor: () => void;
  editorOpen: boolean;
};

export default function PlaybackControls(p: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = p.totalSteps
    ? Math.min(100, Math.round(((p.stepIndex + 1) / p.totalSteps) * 100))
    : 0;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".playback-action",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, {
      width: `${progress}%`,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  }, [progress]);

  const secondaryButton =
    "playback-action inline-flex items-center justify-center gap-2 rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-xs font-semibold text-[#4e604d] transition hover:border-[#b8cda0] hover:bg-[#f5f8ef] hover:text-[#203626] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a3c27c]/60";

  const selectClass =
    "mt-2 w-full rounded-xl border border-[#dfe5d8] bg-[#fbfcf8] px-3 py-3 text-sm text-[#2c402e] outline-none transition focus:border-[#9db783] focus:ring-2 focus:ring-[#a9c78d]/20";

  return (
    <div ref={rootRef}>
      <SectionCard
        number="03"
        eyebrow="Playback"
        title="Playback and graph controls"
        icon={<SlidersHorizontal size={16} className="text-[#718f4e]" />}
        description="Step through execution and inspect how the graph changes."
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={secondaryButton}
            onClick={p.onPrevious}
            disabled={p.totalSteps === 0 || p.stepIndex <= 0}
          >
            <SkipBack size={15} />
            Previous
          </button>

          <button
            type="button"
            className="playback-action inline-flex items-center justify-center gap-2 rounded-xl bg-[#203626] px-4 py-2.5 text-xs font-bold text-[#e6f6c9] transition hover:bg-[#2e4a33] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9cbd6c]"
            onClick={p.onTogglePlay}
            disabled={p.totalSteps === 0}
          >
            {p.playing ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
            {p.playing ? "Pause" : "Play on graph"}
          </button>

          <button
            type="button"
            className={secondaryButton}
            onClick={p.onNext}
            disabled={p.totalSteps === 0 || p.stepIndex >= p.totalSteps - 1}
          >
            Next
            <SkipForward size={15} />
          </button>

          <span className="ml-auto rounded-lg border border-[#e2e8dc] bg-[#f7f9f3] px-3 py-2.5 font-mono text-xs text-[#55783b]">
            {p.totalSteps ? `${p.stepIndex + 1} / ${p.totalSteps}` : "0 / 0"}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-[#758171]">
            Playback speed
            <select
              className={selectClass}
              value={p.speed}
              onChange={(event) => p.onSpeed(Number(event.target.value))}
            >
              <option value={1600}>Slow · 0.6×</option>
              <option value={1000}>Normal · 1×</option>
              <option value={600}>Fast · 1.7×</option>
              <option value={300}>Very fast · 3.3×</option>
            </select>
          </label>

          <label className="block text-xs font-semibold text-[#758171]">
            Repeat playback
            <select
              className={selectClass}
              value={p.repeats}
              onChange={(event) => p.onRepeats(Number(event.target.value))}
            >
              <option value={2}>2 times</option>
              <option value={3}>3 times</option>
              <option value={4}>4 times</option>
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-xl border border-[#e7ebe2] bg-[#f7f9f3] p-4">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs">
            <span className="text-[#778176]">Playback progress</span>
            <span className="font-mono font-bold text-[#55783b]">{progress}%</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-[#e4e9df]"
            role="progressbar"
            aria-label="Playback progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              ref={progressRef}
              className="h-full rounded-full bg-gradient-to-r from-[#638640] to-[#b2d66f]"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e9ede5] pt-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#203626]">Customize your graph</p>
            <p className="mt-1 text-xs leading-5 text-[#778176]">
              Open the editor to add, remove, or modify weighted edges.
            </p>
          </div>

          <button type="button" className={secondaryButton} onClick={p.onToggleEditor}>
            {p.editorOpen ? <RotateCcw size={14} /> : <SlidersHorizontal size={14} />}
            {p.editorOpen ? "Hide editor" : "Change graph values"}
          </button>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[#879083]">
          <FastForward size={14} className="shrink-0 text-[#718f4e]" />
          Playback advances through your existing execution steps.
        </p>
      </SectionCard>
    </div>
  );
}