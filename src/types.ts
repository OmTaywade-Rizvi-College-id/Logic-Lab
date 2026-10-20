// src/types.ts

export type SortingAlgorithmId =
  | "selectionSort"
  | "insertionSort"
  | "quickSort";

export type GraphAlgorithmId =
  | "dijkstra"
  | "bfs"
  | "dfs"
  | "prim";

export type AlgorithmId =
  | SortingAlgorithmId
  | GraphAlgorithmId;

export type AlgorithmKind = "sorting" | "graph";

export interface AlgorithmComplexity {
  best: string;
  average: string;
  worst: string;
}

export interface AlgorithmConfig {
  id: AlgorithmId;
  label: string;
  kind: AlgorithmKind;
  description: string;
  timeComplexity: AlgorithmComplexity;
  spaceComplexity: string;
  sourceCode:
    | string
    | {
        typescript?: string;
        cpp?: string;
        python?: string;
      };
  requiresWeights: boolean;
  requiresDestination: boolean;
}
export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphRequest {
  algorithm: GraphAlgorithmId;
  nodes: string[];
  edges: Edge[];
  startNode: string;
  endNode?: string;
  directed: boolean;
}

export type GraphAction =
  | "start"
  | "visit"
  | "compare"
  | "relax"
  | "enqueue"
  | "push"
  | "select-edge"
  | "complete"
  | "error";

export interface GraphStep {
  stepNumber: number;
  action: GraphAction;
  message: string;
  explanation: string;

  currentNode?: string;
  node?: string;

  edgeFrom?: string;
  edgeTo?: string;
  activeEdge?: Edge;

  visitedNodes: string[];
  visited?: string[];

  queue: string[];
  stack: string[];

  distances: Record<string, number>;
  distanceSnapshot?: Record<string, number>;

  distance?: number;
  selectedEdges: Edge[];
  totalWeight: number;

  sourceLine?: number;
}

export interface GraphResult {
  algorithm: GraphAlgorithmId;
  steps: GraphStep[];
  visitedOrder: string[];
  selectedEdges: Edge[];
  distances: Record<string, number>;
  path: string[];
  totalWeight: number;
  error?: string;
}

export type SortingAction =
  | "start"
  | "compare"
  | "swap"
  | "shift"
  | "insert"
  | "pivot"
  | "partition"
  | "complete";

export interface SortingStep {
  stepNumber: number;
  action: SortingAction;
  explanation: string;
  array: number[];

  indexI?: number;
  indexJ?: number;
  keyIndex?: number;
  pivotIndex?: number;
  low?: number;
  high?: number;
  minIndex?: number;

  activeIndices: number[];
  sortedIndices: number[];

  comparisons: number;
  swaps: number;
  writes: number;

  swapped?: boolean;
  sourceLine?: number;
}

export interface SortingResult {
  algorithm: SortingAlgorithmId;
  originalArray: number[];
  sortedArray: number[];
  steps: SortingStep[];
  comparisons: number;
  swaps: number;
  writes: number;
  ascending: boolean;
}

export interface SortingRequest {
  algorithm: SortingAlgorithmId;
  values: number[];
  ascending?: boolean;
}