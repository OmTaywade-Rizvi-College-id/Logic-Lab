// src/algorithms/insertionSort.ts

import type { SortingRequest, SortingResult, SortingStep } from "../types";

export function insertionSort(request: SortingRequest): SortingResult {
  const originalArray = [...request.values];
  const array = [...request.values];
  const ascending = request.ascending ?? true;
  const steps: SortingStep[] = [];
  const sortedIndices: number[] = [];

  let comparisons = 0;
  let swaps = 0;
  let writes = 0;

  const shouldShift = (left: number, right: number) =>
    ascending ? left > right : left < right;

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

  record("start", "Begin insertion sort.", []);

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    record(
      "insert",
      `Take ${key} as the value to insert into the sorted section.`,
      [i],
      { indexI: i, keyIndex: i, sourceLine: 1 },
    );

    while (j >= 0) {
      comparisons++;

      record(
        "compare",
        `Compare ${array[j]} with ${key}.`,
        [j, j + 1],
        { indexI: i, indexJ: j, keyIndex: i, sourceLine: 2 },
      );

      if (!shouldShift(array[j], key)) break;

      array[j + 1] = array[j];
      writes++;

      record(
        "shift",
        `Shift ${array[j]} one position to the right.`,
        [j, j + 1],
        { indexI: i, indexJ: j, keyIndex: i, sourceLine: 3 },
      );

      j--;
    }

    array[j + 1] = key;
    writes++;

    record(
      "insert",
      `Insert ${key} at index ${j + 1}.`,
      [j + 1],
      { indexI: i, keyIndex: j + 1, sourceLine: 4 },
    );

    sortedIndices.length = 0;
    for (let k = 0; k <= i; k++) sortedIndices.push(k);
  }

  if (array.length === 1) sortedIndices.push(0);

  record("complete", "Insertion sort completed.", []);

  return {
    algorithm: "insertionSort",
    originalArray,
    sortedArray: array,
    steps,
    comparisons,
    swaps,
    writes,
    ascending,
  };
}