import type { SortingResult, SortingStep } from "../types";
import { validateSortingInput } from "./validation";

export const selectionSortSource = {
  typescript: `function selectionSort(input: number[], ascending = true) {
  const array = [...input];

  for (let i = 0; i < array.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      if (ascending ? array[j] < array[minIndex] : array[j] > array[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }

  return array;
}`,
  cpp: `vector<int> selectionSort(vector<int> a, bool ascending = true) {
  for (int i = 0; i < (int)a.size(); i++) {
    int minIndex = i;
    for (int j = i + 1; j < (int)a.size(); j++) {
      if (ascending ? a[j] < a[minIndex] : a[j] > a[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) swap(a[i], a[minIndex]);
  }
  return a;
}`,
  python: `def selection_sort(values, ascending=True):
    a = values[:]
    for i in range(len(a)):
        min_index = i
        for j in range(i + 1, len(a)):
            if (a[j] < a[min_index] if ascending
                    else a[j] > a[min_index]):
                min_index = j
        if min_index != i:
            a[i], a[min_index] = a[min_index], a[i]
    return a`,
};

export function runSelectionSort(
  input: number[],
  ascending = true,
): SortingResult {
  const errors = validateSortingInput("selectionSort", input);

  if (errors.length) {
    throw new Error(errors.join(" "));
  }

  const array = [...input];
  const steps: SortingStep[] = [];

  let comparisons = 0;
  let swaps = 0;
  let writes = 0;

  function record(
    action: SortingStep["action"],
    explanation: string,
    sourceLine: number,
    extra: Partial<SortingStep> = {},
  ) {
    steps.push({
      stepNumber: steps.length,
      action,
      explanation,
      array: [...array],
      activeIndices: [],
      sortedIndices: [],
      sourceLine,
      comparisons,
      swaps,
      writes,
      ...extra,
    });
  }

  record("start", "Start Selection Sort.", 1);

  for (let i = 0; i < array.length; i++) {
    let minIndex = i;

    record(
      "start",
      `Assume ${array[i]} at index ${i} is the minimum.`,
      4,
      { indexI: i, minIndex, activeIndices: [i] },
    );

    for (let j = i + 1; j < array.length; j++) {
      comparisons++;

      record(
        "compare",
        `Compare ${array[j]} with ${array[minIndex]}.`,
        7,
        {
          indexI: i,
          indexJ: j,
          minIndex,
          activeIndices: [j, minIndex],
        },
      );

      const isBetter = ascending
        ? array[j] < array[minIndex]
        : array[j] > array[minIndex];

      if (isBetter) {
        minIndex = j;

        record(
          "compare",
          `New candidate: ${array[minIndex]}.`,
          8,
          {
            indexI: i,
            indexJ: j,
            minIndex,
            activeIndices: [minIndex],
          },
        );
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [
        array[minIndex],
        array[i],
      ];

      swaps++;
      writes += 2;

      record(
        "swap",
        `Swap index ${i} with index ${minIndex}.`,
        12,
        {
          indexI: i,
          indexJ: minIndex,
          minIndex,
          activeIndices: [i, minIndex],
          swapped: true,
        },
      );
    }

    record(
      "complete",
      `Position ${i} is finalized.`,
      14,
      {
        indexI: i,
        sortedIndices: Array.from(
          { length: i + 1 },
          (_, index) => index,
        ),
      },
    );
  }

  record(
    "complete",
    "Selection Sort finished.",
    16,
    { sortedIndices: array.map((_, index) => index) },
  );

  return {
    algorithm: "selectionSort",
    originalArray: [...input],
    sortedArray: array,
    steps,
    comparisons,
    swaps,
    writes,
    ascending,
  };
}