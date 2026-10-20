// src/api.ts

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
import { runSortingAlgorithm } from "./algorithms/sortingAlgorithms";

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
  request: GraphRequest | SortingRequest,
): GraphResult | SortingResult {
  if (isGraphAlgorithm(request.algorithm)) {
    return runGraphAlgorithm(request as GraphRequest);
  }

  return runSortingAlgorithm(request as SortingRequest);
}

export type {
  GraphRequest,
  GraphResult,
  SortingRequest,
  SortingResult,
};