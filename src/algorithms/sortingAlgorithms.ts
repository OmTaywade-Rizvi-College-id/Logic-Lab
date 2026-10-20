// src/algorithms/sortingAlgorithms.ts

import type {
  SortingAlgorithmId,
  SortingRequest,
  SortingResult,
} from "../types";

import { insertionSort } from "./insertionSort";
import { selectionSort } from "./selectionSort";
import { quickSort } from "./quickSort";
import { validateSortingRequest } from "./validation";

export function runSortingAlgorithm(
  request: SortingRequest,
): SortingResult {
  const validation = validateSortingRequest(request);

  if (!validation.valid) {
    throw new Error(validation.errors.join("\n"));
  }

  switch (request.algorithm as SortingAlgorithmId) {
    case "insertionSort":
      return insertionSort(request);

    case "selectionSort":
      return selectionSort(request);

    case "quickSort":
      return quickSort(request);

    default:
      throw new Error(
        `Unsupported sorting algorithm: ${request.algorithm}`,
      );
  }
}