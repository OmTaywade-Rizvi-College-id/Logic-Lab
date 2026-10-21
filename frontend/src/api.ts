// src/api.ts

import type {
  AlgorithmId,
  GraphAlgorithmId,
  GraphRequest,
  GraphResult,
  SortingAlgorithmId,
  SortingResult,
} from "./types";

import { runGraphAlgorithm } from "./algorithms/graphAlgorithms";

import { runSelectionSort } from "./algorithms/selectionSort";
import { runInsertionSort } from "./algorithms/insertionSort";
import { runQuickSort } from "./algorithms/quickSort";

export function checkApi(): boolean {
  // LogicLab runs algorithms locally in the browser.
  return true;
}

export function runAlgorithm(
  algorithm: GraphAlgorithmId,
  request: Omit<GraphRequest, "algorithm">,
): GraphResult {
  return runGraphAlgorithm(algorithm, request);
}

export function runSortingAlgorithm(
  algorithm: SortingAlgorithmId,
  input: number[],
  ascending = true,
): SortingResult {
  switch (algorithm) {
    case "selectionSort":
      return runSelectionSort(input, ascending);

    case "insertionSort":
      return runInsertionSort(input, ascending);

    case "quickSort":
      return runQuickSort(input, ascending);

    default: {
      const exhaustive: never = algorithm;
      throw new Error(`Unsupported sorting algorithm: ${exhaustive}`);
    }
  }
}

export function isSortingAlgorithm(
  algorithm: AlgorithmId,
): algorithm is SortingAlgorithmId {
  return (
    algorithm === "selectionSort" ||
    algorithm === "insertionSort" ||
    algorithm === "quickSort"
  );
}

export function isGraphAlgorithm(
  algorithm: AlgorithmId,
): algorithm is GraphAlgorithmId {
  return (
    algorithm === "dijkstra" ||
    algorithm === "bfs" ||
    algorithm === "dfs" ||
    algorithm === "prim"
  );
}