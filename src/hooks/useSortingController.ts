import { useCallback, useEffect, useRef, useState } from "react";

import type {
  SortingAlgorithmId,
  SortingRequest,
  SortingResult,
  SortingStep,
} from "../types";

import { runSortingAlgorithm } from "../api";

const DEFAULT_VALUES = [34, 12, 78, 9, 56];

export function useSortingController(algorithm: SortingAlgorithmId) {
  const [values, setValues] = useState<number[]>(DEFAULT_VALUES);
  const [result, setResult] = useState<SortingResult | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [ascending, setAscending] = useState(true);
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [error, setError] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    stopTimer();
    setPlaying(false);
  }, [stopTimer]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    stopTimer();
    setPlaying(false);
    setBusy(false);
    setResult(null);
    setStepIndex(0);
    setError("");
  }, [stopTimer]);

  useEffect(() => {
    reset();
  }, [algorithm, reset]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      stopTimer();
    };
  }, [stopTimer]);

  const run = useCallback(
    async (inputValues: number[], inputAscending = true) => {
      const requestId = ++requestIdRef.current;

      stopTimer();
      setPlaying(false);
      setBusy(true);
      setError("");
      setValues([...inputValues]);
      setAscending(inputAscending);
      setResult(null);
      setStepIndex(0);

      try {
        const request: SortingRequest = {
          algorithm,
          values: [...inputValues],
          ascending: inputAscending,
        };

        const data = await Promise.resolve(
          runSortingAlgorithm(request),
        );

        if (requestId !== requestIdRef.current) return;

        setResult(data);
        setStepIndex(0);
      } catch (cause) {
        if (requestId !== requestIdRef.current) return;

        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to run sorting.",
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setBusy(false);
        }
      }
    },
    [algorithm, stopTimer],
  );

  const next = useCallback(() => {
    setStepIndex((current) => {
      const lastIndex = (result?.steps.length ?? 0) - 1;
      return Math.min(current + 1, Math.max(0, lastIndex));
    });
  }, [result]);

  const previous = useCallback(() => {
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  useEffect(() => {
    if (!playing || !result) return;

    if (stepIndex >= result.steps.length - 1) {
      setPlaying(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setStepIndex((current) =>
        Math.min(current + 1, result.steps.length - 1),
      );
    }, speed);

    return stopTimer;
  }, [playing, result, stepIndex, speed, stopTimer]);

  const play = useCallback(() => {
    if (!result || result.steps.length === 0) return;

    if (stepIndex >= result.steps.length - 1) {
      setStepIndex(0);
    }

    setPlaying(true);
  }, [result, stepIndex]);

  const step: SortingStep | undefined = result?.steps[stepIndex];

  return {
    values,
    result,
    step,
    stepIndex,
    ascending,
    busy,
    playing,
    speed,
    error,
    setSpeed,
    setAscending,
    run,
    play,
    pause,
    next,
    previous,
    reset,
  };
}