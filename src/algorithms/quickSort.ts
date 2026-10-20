// src/algorithms/quickSort.ts

import type { SortingRequest, SortingResult, SortingStep } from "../types";

export function quickSort(request: SortingRequest): SortingResult {
  const originalArray = [...request.values];
  const array = [...request.values];
  const ascending = request.ascending ?? true;
  const steps: SortingStep[] = [];
  const sortedIndices: number[] = [];

  let comparisons = 0;
  let swaps = 0;
  let writes = 0;

  const isBefore = (a: number, b: number) =>
    ascending ? a <= b : a >= b;

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

  const swap = (i: number, j: number) => {
    if (i === j) return;

    [array[i], array[j]] = [array[j], array[i]];
    swaps++;
    writes += 2;

    record(
      "swap",
      `Swap indices ${i} and ${j}.`,
      [i, j],
      { indexI: i, indexJ: j, swapped: true, sourceLine: 3 },
    );
  };

  record("start", "Begin quick sort.", []);

  const partition = (low: number, high: number): number => {
    const pivot = array[high];

    record(
      "pivot",
      `Choose ${pivot} at index ${high} as the pivot.`,
      [high],
      { pivotIndex: high, low, high, sourceLine: 1 },
    );

    let boundary = low;

    for (let j = low; j < high; j++) {
      comparisons++;

      record(
        "compare",
        `Compare ${array[j]} with pivot ${pivot}.`,
        [j, high],
        { indexI: boundary, indexJ: j, pivotIndex: high, low, high,
          sourceLine: 2 },
      );

      if (isBefore(array[j], pivot)) {
        swap(boundary, j);
        boundary++;
      }
    }

    swap(boundary, high);
    sortedIndices.push(boundary);

    record(
      "partition",
      `Pivot ${pivot} is placed at its final index ${boundary}.`,
      [boundary],
      { pivotIndex: boundary, low, high, sourceLine: 4 },
    );

    return boundary;
  };

  const sort = (low: number, high: number): void => {
    if (low > high) return;

    if (low === high) {
      if (!sortedIndices.includes(low)) sortedIndices.push(low);
      return;
    }

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  };

  sort(0, array.length - 1);

  for (let i = 0; i < array.length; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  record("complete", "Quick sort completed.", []);

  return {
    algorithm: "quickSort",
    originalArray,
    sortedArray: array,
    steps,
    comparisons,
    swaps,
    writes,
    ascending,
  };
}