import type { SortingResult, SortingStep } from "../types";
import { validateSortingInput } from "./validation";

export const insertionSortSource = {
  typescript: `function insertionSort(input: number[], ascending = true) {
  const array = [...input];

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    while (j >= 0 && (ascending ? array[j] > key : array[j] < key)) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = key;
  }

  return array;
}`,
  cpp: `vector<int> insertionSort(vector<int> a, bool ascending = true) {
  for (int i = 1; i < (int)a.size(); i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && (ascending ? a[j] > key : a[j] < key)) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`,
  python: `def insertion_sort(values, ascending=True):
    a = values[:]
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and (a[j] > key if ascending else a[j] < key):
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`,
};

export function runInsertionSort(
  input: number[],
  ascending = true,
): SortingResult {
  const errors = validateSortingInput("insertionSort", input);

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

  record("start", "Start Insertion Sort.", 1);

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    record("start", `Select ${key} as the key.`, 4, {
      indexI: i,
      keyIndex: i,
      activeIndices: [i],
    });

    while (j >= 0) {
      comparisons++;

      record("compare", `Compare ${array[j]} with key ${key}.`, 7, {
        indexI: i,
        indexJ: j,
        keyIndex: i,
        activeIndices: [j, i],
      });

      const shouldShift = ascending
        ? array[j] > key
        : array[j] < key;

      if (!shouldShift) break;

      array[j + 1] = array[j];
      writes++;

      record(
        "shift",
        `Shift ${array[j]} from index ${j} to ${j + 1}.`,
        8,
        {
          indexI: i,
          indexJ: j,
          keyIndex: i,
          activeIndices: [j, j + 1],
        },
      );

      j--;
    }

    array[j + 1] = key;
    writes++;

    record("insert", `Insert key ${key} at index ${j + 1}.`, 12, {
      indexI: i,
      keyIndex: j + 1,
      activeIndices: [j + 1],
    });
  }

  record("complete", "Insertion Sort finished.", 15, {
    sortedIndices: array.map((_, index) => index),
  });

  return {
    algorithm: "insertionSort",
    originalArray: [...input],
    sortedArray: array,
    steps,
    comparisons,
    swaps,
    writes,
    ascending,
  };
}