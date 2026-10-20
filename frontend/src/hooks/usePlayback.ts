import { useCallback, useEffect, useState } from "react";

export interface PlaybackOptions {
  initialSpeed?: number;
  minSpeed?: number;
  maxSpeed?: number;
}

export function usePlayback<T>(
  steps: T[],
  options: PlaybackOptions = {},
) {
  const {
    initialSpeed = 1,
    minSpeed = 0.25,
    maxSpeed = 4,
  } = options;

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const totalSteps = steps.length;
  const currentStep = steps[stepIndex] ?? null;

  const next = useCallback(() => {
    setStepIndex((index) =>
      Math.min(index + 1, Math.max(0, steps.length - 1)),
    );
  }, [steps.length]);

  const previous = useCallback(() => {
    setStepIndex((index) => Math.max(0, index - 1));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
  }, []);

  const seek = useCallback(
    (index: number) => {
      if (!Number.isFinite(index)) return;

      setStepIndex(
        Math.max(0, Math.min(Math.floor(index), steps.length - 1)),
      );
    },
    [steps.length],
  );

  const play = useCallback(() => {
    if (steps.length > 1) {
      setStepIndex((index) =>
        index >= steps.length - 1 ? 0 : index,
      );
      setPlaying(true);
    }
  }, [steps.length]);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const changeSpeed = useCallback(
    (nextSpeed: number) => {
      if (!Number.isFinite(nextSpeed)) return;

      setSpeed(Math.max(minSpeed, Math.min(maxSpeed, nextSpeed)));
    },
    [minSpeed, maxSpeed],
  );

  useEffect(() => {
    if (!playing || steps.length < 2) return;

    const delay = 700 / speed;

    const timer = window.setTimeout(() => {
      setStepIndex((index) => {
        if (index >= steps.length - 1) {
          setPlaying(false);
          return index;
        }

        return index + 1;
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, steps.length, speed]);

  // Clamp the index when a new execution produces fewer steps.
  useEffect(() => {
    setStepIndex((index) =>
      Math.min(index, Math.max(0, steps.length - 1)),
    );

    if (steps.length < 2) setPlaying(false);
  }, [steps.length]);

  return {
    steps,
    stepIndex,
    currentStep,
    totalSteps,
    playing,
    speed,
    setPlaying,
    setSpeed: changeSpeed,
    next,
    previous,
    reset,
    seek,
    play,
    pause,
    isFirst: stepIndex === 0,
    isLast: totalSteps === 0 || stepIndex >= totalSteps - 1,
  };
}