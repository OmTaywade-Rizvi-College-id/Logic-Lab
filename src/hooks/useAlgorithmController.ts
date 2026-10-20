import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  AlgorithmId,
  GraphAlgorithmId,
  GraphRequest,
  GraphResult,
  GraphStep,
  SortingAlgorithmId,
  SortingRequest,
  SortingResult,
  SortingStep,
} from "../types";

import {
  runAlgorithm,
  runSortingAlgorithm,
  isGraphAlgorithm,
  isSortingAlgorithm,
} from "../api";

import { usePlayback } from "./usePlayback";

type ExecutionResult = GraphResult | SortingResult;
type ExecutionStep = GraphStep | SortingStep;

interface AlgorithmControllerOptions {
  algorithm: AlgorithmId;
}

export function useAlgorithmController({
  algorithm,
}: AlgorithmControllerOptions) {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isGraph = isGraphAlgorithm(algorithm);
  const isSorting = isSortingAlgorithm(algorithm);

  const steps = useMemo<ExecutionStep[]>(
    () => (result ? result.steps : []),
    [result],
  );

  const playback = usePlayback<ExecutionStep>(steps);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setBusy(false);
    playback.reset();
  }, [playback.reset]);

  useEffect(() => {
    setResult(null);
    setError(null);
    setBusy(false);
    playback.reset();
  }, [algorithm, playback.reset]);

  const runGraph = useCallback(
    (request: GraphRequest): GraphResult | null => {
      if (!isGraph) {
        setError(`${algorithm} is not a graph algorithm.`);
        return null;
      }

      setBusy(true);
      setError(null);
      playback.reset();

      try {
        const graphRequest: GraphRequest = {
          ...request,
          algorithm: algorithm as GraphAlgorithmId,
        };

        const graphResult = runAlgorithm(graphRequest);

        if (!("visitedOrder" in graphResult)) {
          throw new Error("Expected a graph algorithm result.");
        }

        setResult(graphResult);
        return graphResult;
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Unable to execute the graph algorithm.";

        setResult(null);
        setError(message);
        return null;
      } finally {
        setBusy(false);
      }
    },
    [algorithm, isGraph, playback.reset],
  );

  const runSorting = useCallback(
    (
      values: number[],
      ascending = true,
    ): SortingResult | null => {
      if (!isSorting) {
        setError(`${algorithm} is not a sorting algorithm.`);
        return null;
      }

      setBusy(true);
      setError(null);
      playback.reset();

      try {
        const sortingRequest: SortingRequest = {
          algorithm: algorithm as SortingAlgorithmId,
          values,
          ascending,
        };

        const sortingResult = runSortingAlgorithm(sortingRequest);

        setResult(sortingResult);
        return sortingResult;
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Unable to execute the sorting algorithm.";

        setResult(null);
        setError(message);
        return null;
      } finally {
        setBusy(false);
      }
    },
    [algorithm, isSorting, playback.reset],
  );

  return {
    algorithm,
    result,
    error,
    busy,
    isGraph,
    isSorting,
    steps,
    playback,
    runGraph,
    runSorting,
    clearResult,
  };
}