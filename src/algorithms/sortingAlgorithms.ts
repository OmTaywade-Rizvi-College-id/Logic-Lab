import type {
    SortingAlgorithmId,
    SortingResult,
    SortingStep,
} from "../types";
import { validateSortingInput } from "./validation";

interface RunState {
    array: number[];
    steps: SortingStep[];
    comparisons: number;
    swaps: number;
    writes: number;
    ascending: boolean;
}

function compare(a: number, b: number, ascending: boolean): boolean {
    return ascending ? a < b : a > b;
}

function snapshot(
    state: RunState,
    action: SortingStep["action"],
    explanation: string,
    options: Partial<SortingStep> = {},
): void {
    const step: SortingStep = {
        stepNumber: state.steps.length,
        action,
        explanation,
        array: [...state.array],
        activeIndices: [],
        sortedIndices: [],
        comparisons: state.comparisons,
        swaps: state.swaps,
        writes: state.writes,
        sourceLine: 1,
        ...options,
    };

    state.steps.push(step);
}

function initialize(
    input: number[],
    ascending: boolean,
): RunState {
    return {
        array: [...input],
        steps: [],
        comparisons: 0,
        swaps: 0,
        writes: 0,
        ascending,
    };
}

function selectionSort(state: RunState): void {
    const a = state.array;
    const n = a.length;

    for (let i = 0; i < n; i++) {
        let minIndex = i;

        snapshot(state, "start", `Start searching from index ${i}.`, {
            indexI: i,
            minIndex,
            activeIndices: [i],
            sourceLine: 2,
        });

        for (let j = i + 1; j < n; j++) {
            state.comparisons++;

            snapshot(
                state,
                "compare",
                `Compare ${a[j]} with the current candidate ${a[minIndex]}.`,
                {
                    indexI: i,
                    indexJ: j,
                    minIndex,
                    activeIndices: [j, minIndex],
                    sourceLine: 4,
                },
            );

            if (compare(a[j], a[minIndex], state.ascending)) {
                minIndex = j;

                snapshot(
                    state,
                    "compare",
                    `${a[minIndex]} becomes the new minimum candidate.`,
                    {
                        indexI: i,
                        indexJ: j,
                        minIndex,
                        activeIndices: [minIndex],
                        sourceLine: 5,
                    },
                );
            }
        }

        if (minIndex !== i) {
            [a[i], a[minIndex]] = [a[minIndex], a[i]];
            state.swaps++;
            state.writes += 2;

            snapshot(state, "swap", `Swap indices ${i} and ${minIndex}.`, {
                indexI: i,
                indexJ: minIndex,
                minIndex,
                activeIndices: [i, minIndex],
                swapped: true,
                sourceLine: 7,
            });
        }

        snapshot(state, "complete", `Index ${i} is now in its final position.`, {
            indexI: i,
            sortedIndices: Array.from({ length: i + 1 }, (_, index) => index),
            sourceLine: 9,
        });
    }
}

function insertionSort(state: RunState): void {
    const a = state.array;

    for (let i = 1; i < a.length; i++) {
        const key = a[i];
        let j = i - 1;

        snapshot(state, "start", `Select ${key} as the insertion key.`, {
            indexI: i,
            keyIndex: i,
            activeIndices: [i],
            sourceLine: 2,
        });

        while (j >= 0) {
            state.comparisons++;

            snapshot(state, "compare", `Compare ${a[j]} with key ${key}.`, {
                indexI: i,
                indexJ: j,
                keyIndex: i,
                activeIndices: [j, i],
                sourceLine: 5,
            });

            if (!compare(key, a[j], state.ascending)) {
                break;
            }

            a[j + 1] = a[j];
            state.writes++;

            snapshot(state, "shift", `Shift ${a[j]} one position to the right.`, {
                indexI: i,
                indexJ: j,
                keyIndex: i,
                activeIndices: [j, j + 1],
                sourceLine: 6,
            });

            j--;
        }

        a[j + 1] = key;
        state.writes++;

        snapshot(state, "insert", `Insert key ${key} at index ${j + 1}.`, {
            indexI: i,
            keyIndex: j + 1,
            activeIndices: [j + 1],
            sourceLine: 9,
        });
    }
}

function quickSort(state: RunState): void {
    const a = state.array;

    function partition(low: number, high: number): number {
        const pivot = a[high];
        let i = low;

        snapshot(state, "pivot", `Choose ${pivot} as the pivot.`, {
            low,
            high,
            pivotIndex: high,
            activeIndices: [high],
            sourceLine: 4,
        });

        for (let j = low; j < high; j++) {
            state.comparisons++;

            snapshot(state, "compare", `Compare ${a[j]} with pivot ${pivot}.`, {
                low,
                high,
                indexI: i,
                indexJ: j,
                pivotIndex: high,
                activeIndices: [j, high],
                sourceLine: 6,
            });

            const belongsLeft = state.ascending
                ? a[j] <= pivot
                : a[j] >= pivot;

            if (belongsLeft) {
                if (i !== j) {
                    [a[i], a[j]] = [a[j], a[i]];
                    state.swaps++;
                    state.writes += 2;

                    snapshot(state, "swap", `Swap indices ${i} and ${j}.`, {
                        low,
                        high,
                        indexI: i,
                        indexJ: j,
                        pivotIndex: high,
                        activeIndices: [i, j],
                        swapped: true,
                        sourceLine: 8,
                    });
                }

                i++;
            }
        }

        if (i !== high) {
            [a[i], a[high]] = [a[high], a[i]];
            state.swaps++;
            state.writes += 2;
        }

        snapshot(state, "partition", `Place pivot ${pivot} at index ${i}.`, {
            low,
            high,
            pivotIndex: i,
            indexI: i,
            activeIndices: [i],
            sourceLine: 11,
        });

        return i;
    }

    function sort(low: number, high: number): void {
        if (low >= high) return;

        const pivotIndex = partition(low, high);

        sort(low, pivotIndex - 1);
        sort(pivotIndex + 1, high);
    }

    sort(0, a.length - 1);
}

export function runSortingAlgorithm(
    algorithm: SortingAlgorithmId,
    input: number[],
    ascending = true,
): SortingResult {
    const errors = validateSortingInput(algorithm, input);

    if (errors.length > 0) {
        throw new Error(errors.join(" "));
    }

    const state = initialize(input, ascending);

    switch (algorithm) {
        case "selectionSort":
            selectionSort(state);
            break;

        case "insertionSort":
            insertionSort(state);
            break;

        case "quickSort":
            quickSort(state);
            break;

        default: {
            const exhaustive: never = algorithm;
            throw new Error(`Unsupported algorithm: ${exhaustive}`);
        }
    }

    snapshot(state, "complete", "Sorting is complete.", {
        sortedIndices: state.array.map((_, index) => index),
        sourceLine: 1,
    });

    return {
        algorithm,
        originalArray: [...input],
        sortedArray: [...state.array],
        steps: state.steps,
        comparisons: state.comparisons,
        swaps: state.swaps,
        writes: state.writes,
        ascending,
    };
}