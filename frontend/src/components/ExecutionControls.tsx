import { useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Activity } from "lucide-react";
import gsap from "gsap";

interface ExecutionControlsProps {
  isPlaying: boolean;
  onRun: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  stepIndex: number;
  totalSteps: number;
}

export default function ExecutionControls({
  isPlaying, onRun, onPause, onNext, onPrevious, onReset, stepIndex, totalSteps,
}: ExecutionControlsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasSteps = totalSteps > 0;
  const isLastStep = hasSteps && stepIndex >= totalSteps - 1;
  const progress = hasSteps ? Math.min(100, Math.max(0, ((stepIndex + 1) / totalSteps) * 100)) : 0;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".execution-control", { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.35, stagger: 0.055, ease: "power2.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const buttonBase = "execution-control inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9acb61]/60 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm";

  return (
    <div ref={rootRef} className="rounded-[24px] border border-[#e2e7dc] bg-white p-4 text-[#203725] shadow-[0_14px_40px_rgba(33,55,33,0.055)] sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d9e6ca] bg-[#eff5e6] text-[#5d813c]"><Activity size={18} /></div>
          <div>
            <h3 className="text-sm font-semibold text-[#203725]">Execution Controls</h3>
            <p className="mt-1 text-xs text-[#7b8778]">Control algorithm playback</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${isPlaying ? "border-[#d2e6bf] bg-[#edf5e6] text-[#517b35]" : "border-[#e4e8df] bg-[#f8faf5] text-[#778373]"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "animate-pulse bg-[#79ad43]" : "bg-[#a4ada0]"}`} />
          {isPlaying ? "Running" : "Paused"}
        </span>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
          <span className="text-[#718070]">Execution progress</span>
          <span className="font-mono text-[#5b7f39]">{hasSteps ? `${Math.min(stepIndex + 1, totalSteps)} / ${totalSteps}` : "0 / 0"}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#edf0e8]" role="progressbar" aria-label="Execution progress" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={hasSteps ? Math.min(stepIndex + 1, totalSteps) : 0}>
          <div className="h-full rounded-full bg-gradient-to-r from-[#9acb61] to-[#70b99a] transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={`${buttonBase} border-[#cbdcba] bg-[#eef5e5] text-[#41602e] hover:bg-[#e4efd7]`} onClick={onRun} disabled={isPlaying || !hasSteps || isLastStep}><Play size={15} fill="currentColor" />Run</button>
        <button type="button" className={`${buttonBase} border-[#e2e7dc] bg-white text-[#586958] hover:border-[#d6dfcc] hover:bg-[#f8faf5]`} onClick={onPause} disabled={!isPlaying}><Pause size={15} />Pause</button>
        <div className="mx-1 hidden h-7 w-px bg-[#e3e8dd] sm:block" />
        <button type="button" className={`${buttonBase} border-[#e2e7dc] bg-white text-[#586958] hover:border-[#cbdcba] hover:bg-[#f4f8ee]`} onClick={onPrevious} disabled={!hasSteps || stepIndex <= 0} aria-label="Previous step"><SkipBack size={15} /><span className="hidden sm:inline">Previous</span></button>
        <button type="button" className={`${buttonBase} border-[#e2e7dc] bg-white text-[#586958] hover:border-[#cbdcba] hover:bg-[#f4f8ee]`} onClick={onNext} disabled={!hasSteps || isLastStep} aria-label="Next step"><span className="hidden sm:inline">Next step</span><SkipForward size={15} /></button>
        <button type="button" className={`${buttonBase} ml-auto border-[#edd8d2] bg-[#fff7f4] text-[#9a5145] hover:bg-[#fcece6]`} onClick={onReset}><RotateCcw size={15} />Reset</button>
      </div>
    </div>
  );
}