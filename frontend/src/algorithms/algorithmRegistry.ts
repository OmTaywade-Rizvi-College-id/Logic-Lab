import type { AlgorithmConfig, AlgorithmId } from "../types";

import { selectionSortSource } from "./selectionSort";
import { insertionSortSource } from "./insertionSort";
import { quickSortSource } from "./quickSort";
import { dijkstraSource } from "./dijkstra";
import { bfsSource } from "./bfs";
import { dfsSource } from "./dfs";
import { primSource } from "./prim";

export const algorithms: AlgorithmConfig[] = [
  {
    id: "selectionSort",
    label: "Selection Sort",
    kind: "sorting",
    description: "Selects the minimum or maximum remaining value.",
    timeComplexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    sourceCode: selectionSortSource,
    requiresDestination: false,
  },
  {
    id: "insertionSort",
    label: "Insertion Sort",
    kind: "sorting",
    description: "Inserts values into an already sorted section.",
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    sourceCode: insertionSortSource,
    requiresDestination: false,
  },
  {
    id: "quickSort",
    label: "Quick Sort",
    kind: "sorting",
    description: "Partitions an array around a pivot.",
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(log n) average recursion stack",
    sourceCode: quickSortSource,
    requiresDestination: false,
  },
  {
    id: "dijkstra",
    label: "Dijkstra",
    kind: "graph",
    description: "Finds shortest paths with non-negative edge weights.",
    timeComplexity: {
      best: "O(V²)",
      average: "O(V²)",
      worst: "O(V²)",
    },
    spaceComplexity: "O(V + E)",
    sourceCode: dijkstraSource,
    requiresDestination: true,
  },
  {
    id: "bfs",
    label: "Breadth-First Search",
    kind: "graph",
    description: "Explores reachable nodes level by level.",
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    spaceComplexity: "O(V)",
    sourceCode: bfsSource,
    requiresDestination: true,
  },
  {
    id: "dfs",
    label: "Depth-First Search",
    kind: "graph",
    description: "Explores deeper nodes first.",
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    spaceComplexity: "O(V)",
    sourceCode: dfsSource,
    requiresDestination: true,
  },
  {
    id: "prim",
    label: "Prim's Algorithm",
    kind: "graph",
    description: "Builds a minimum spanning tree for a connected undirected graph.",
    timeComplexity: {
      best: "O(V²)",
      average: "O(V²)",
      worst: "O(V²)",
    },
    spaceComplexity: "O(V + E)",
    sourceCode: primSource,
    requiresDestination: false,
  },
];

export function listAlgorithms(): AlgorithmConfig[] {
  return algorithms;
}

export function getAlgorithm(id: AlgorithmId): AlgorithmConfig {
  const algorithm = algorithms.find((item) => item.id === id);

  if (!algorithm) {
    throw new Error(`Unknown algorithm: ${id}`);
  }

  return algorithm;
}