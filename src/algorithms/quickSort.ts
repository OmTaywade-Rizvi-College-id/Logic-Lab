import type { SortingResult, SortingStep } from "../types";
import { validateSortingInput } from "./validation";

export const quickSortSource = {
  typescript: `function quickSort(input: number[], ascending = true) {
  const array = [...input];

  function partition(low: number, high: number): number {
    const pivot = array[high];
    let boundary = low;

    for (let j = low; j < high; j++) {
      if (ascending ? array[j] <= pivot : array[j] >= pivot) {
        [array[boundary], array[j]] = [array[j], array[boundary]];
        boundary++;
      }
    }

    [array[boundary], array[high]] = [array[high], array[boundary]];
    return boundary;
  }

  function sort(low: number, high: number): void {
    if (low >= high) return;
    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, array.length - 1);
  return array;
}`,
  cpp: `vector<int> quickSort(vector<int> a, bool ascending = true) {
  function<void(int,int)> sort = [&](int low, int high) {
    if (low >= high) return;
    int pivot = a[high], boundary = low;
    for (int j = low; j < high; j++) {
      if (ascending ? a[j] <= pivot : a[j] >= pivot)
        swap(a[boundary++], a[j]);
    }
    swap(a[boundary], a[high]);
    sort(low, boundary - 1);
    sort(boundary + 1, high);
  };
  sort(0, (int)a.size() - 1);
  return a;
}`,
  python: `def quick_sort(values, ascending=True):
    a = values[:]
    def sort(low, high):
        if low >= high:
            return
        pivot = a[high]
        boundary = low
        for j in range(low, high):
            if a[j] <= pivot if ascending else a[j] >= pivot:
                a[boundary], a[j] = a[j], a[boundary]
                boundary += 1
        a[boundary], a[high] = a[high], a[boundary]
        sort(low, boundary - 1)
        sort(boundary + 1, high)
    sort(0, len(a) - 1)
    return a`,
};

export function runQuickSort(
  input: number[],
  ascending = true,
): SortingResult {
  const errors = validateSortingInput("quickSort", input);

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

  function partition(low: number, high: number): number {
    const pivot = array[high];
    let boundary = low;

    record("pivot", `Choose ${pivot} as pivot.`, 4, {
      low,
      high,
      pivotIndex: high,
      activeIndices: [high],
    });

    for (let j = low; j < high; j++) {
      comparisons++;

      record("compare", `Compare ${array[j]} with pivot ${pivot}.`, 8, {
        low,
        high,
        indexI: boundary,
        indexJ: j,
        pivotIndex: high,
        activeIndices: [j, high],
      });

      const belongsLeft = ascending
        ? array[j] <= pivot
        : array[j] >= pivot;

      if (belongsLeft) {
        if (boundary !== j) {
          [array[boundary], array[j]] = [
            array[j],
            array[boundary],
          ];

          swaps++;
          writes += 2;

          record("swap", `Swap indices ${boundary} and ${j}.`, 9, {
            low,
            high,
            indexI: boundary,
            indexJ: j,
            pivotIndex: high,
            activeIndices: [boundary, j],
          });
        }

        boundary++;
      }
    }

    if (boundary !== high) {
      [array[boundary], array[high]] = [
        array[high],
        array[boundary],
      ];

      swaps++;
      writes += 2;

      record("swap", `Move pivot to index ${boundary}.`, 13, {
        low,
        high,
        indexI: boundary,
        indexJ: high,
        pivotIndex: boundary,
        activeIndices: [boundary, high],
      });
    }

    record("partition", `Partition ends at index ${boundary}.`, 14, {
      low,
      high,
      pivotIndex: boundary,
      activeIndices: [boundary],
    });

    return boundary;
  }

  function sort(low: number, high: number): void {
    if (low >= high) return;

    const pivotIndex = partition(low, high);

    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  record("start", "Start Quick Sort.", 1);
  sort(0, array.length - 1);

  record("complete", "Quick Sort finished.", 19, {
    sortedIndices: array.map((_, index) => index),
  });

  return {
    algorithm: "quickSort",
    originalArray: [...input],
    sortedArray: array,
    steps,
    comparisons,
    swaps,
    writes,
    ascending,
  };
}