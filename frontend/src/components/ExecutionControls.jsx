
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
} from "lucide-react";

export default function ExecutionControls({
  isPlaying,
  onRun,
  onPause,
  onNext,
  onPrevious,
  onReset,
  stepIndex,
  totalSteps,
}) {
  return (
    <div className="execution-controls">
      <button
        className="btn-primary"
        onClick={onRun}
        disabled={isPlaying || stepIndex >= totalSteps - 1}
      >
        <Play size={16} /> Run
      </button>

      <button
        className="btn-secondary"
        onClick={onPause}
        disabled={!isPlaying}
      >
        <Pause size={16} /> Pause
      </button>

      <button
        className="btn-secondary"
        onClick={onNext}
        disabled={stepIndex >= totalSteps - 1}
      >
        <SkipForward size={16} /> Step Forward
      </button>

      <button
        className="btn-secondary"
        onClick={onPrevious}
        disabled={stepIndex <= 0}
      >
        <SkipBack size={16} /> Step Back
      </button>

      <button className="btn-secondary reset-button" onClick={onReset}>
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  );
}
