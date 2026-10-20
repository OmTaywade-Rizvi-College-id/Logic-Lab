// src/algorithms/selectionSort.ts

import type { SortingRequest, SortingResult, SortingStep } from "../types";

export function selectionSort(request: SortingRequest): SortingResult {
  const originalArray = [...request.values];
  const array = [...request.values];
  const ascending = request.ascending ?? true;
  const steps: SortingStep[] = [];
  const sortedIndices: number[] = [];

  let comparisons = 0;
  let swaps = 0;
  let writes = 0;

  const outOfOrder = (a: number, b: number) =>
    ascending ? a > b : a < b;

  const record = (
    action: SortingStep["action"],
    explanation: string,
    activeIndices: number[] = [],
    extra: Partial<SortingStep> = {},
  ) => {
    steps.push({
      stepNumber: steps.length + 1,
      action,
      explanation,
      array: [...array],
      activeIndices,
      sortedIndices: [...sortedIndices],
      comparisons,
      swaps,
      writes,
      ...extra,
    });
  };

  record("start", "Begin selection sort.", []);

  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      comparisons++;

      record(
        "compare",
        `Compare ${array[j]} with the current selection ${array[minIndex]}.`,
        [minIndex, j],
        { indexI: i, indexJ: j, minIndex, sourceLine: 2 },
      );

      if (outOfOrder(array[minIndex], array[j])) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      swaps++;
      writes += 2;

      record(
        "swap",
        `Place ${array[i]} at position ${i}.`,
        [i, minIndex],
        { indexI: i, indexJ: minIndex, minIndex, swapped: true, sourceLine: 3 },
      );
    }

    sortedIndices.push(i);
  }

  if (array.length > 0) sortedIndices.push(array.length - 1);

  record("complete", "Selection sort completed.", []);

  return {
    algorithm: "selectionSort",
    originalArray,
    sortedArray: array,
    steps,
    comparisons,
    swaps,
    writes,
    ascending,
  };
}