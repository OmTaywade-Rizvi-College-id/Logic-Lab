import type {
  AlgorithmId,
  GraphAlgorithmId,
  GraphRequest,
  GraphResult,
  SortingAlgorithmId,
  SortingRequest,
  SortingResult,
} from "./types";

import { runGraphAlgorithm } from "./algorithms/graphAlgorithms";
import {
  runSortingAlgorithm as executeSorting,
} from "./algorithms/sortingAlgorithms";

export function isGraphAlgorithm(
  id: AlgorithmId,
): id is GraphAlgorithmId {
  return (
    id === "dijkstra" ||
    id === "bfs" ||
    id === "dfs" ||
    id === "prim"
  );
}

export function isSortingAlgorithm(
  id: AlgorithmId,
): id is SortingAlgorithmId {
  return (
    id === "selectionSort" ||
    id === "insertionSort" ||
    id === "quickSort"
  );
}

export function runAlgorithm(
  request: GraphRequest,
): GraphResult;

export function runAlgorithm(
  request: SortingRequest,
): SortingResult;

export function runAlgorithm(
  request: GraphRequest | SortingRequest,
): GraphResult | SortingResult {
  if (isGraphAlgorithm(request.algorithm)) {
    return runGraphAlgorithm(request as GraphRequest);
  }

  return executeSorting(request as SortingRequest);
}

export function runSortingAlgorithm(
  request: SortingRequest,
): SortingResult {
  return executeSorting(request);
}

export type {
  GraphRequest,
  GraphResult,
  SortingRequest,
  SortingResult,
};