// src/algorithms/graphAlgorithms.ts

import type {
  GraphAlgorithmId,
  GraphRequest,
  GraphResult,
} from "../types";

import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { prim } from "./prim";
import { validateGraphRequest } from "./validation";

export function runGraphAlgorithm(
  request: GraphRequest,
): GraphResult {
  const validation = validateGraphRequest(request);

  if (!validation.valid) {
    const message = validation.errors.join("\n");

    return {
      algorithm: request.algorithm,
      steps: [],
      visitedOrder: [],
      selectedEdges: [],
      distances: {},
      path: [],
      totalWeight: 0,
      error: message,
    };
  }

  switch (request.algorithm as GraphAlgorithmId) {
    case "bfs":
      return bfs(request);

    case "dfs":
      return dfs(request);

    case "dijkstra":
      return dijkstra(request);

    case "prim":
      return prim(request);

    default:
      return {
        algorithm: request.algorithm,
        steps: [],
        visitedOrder: [],
        selectedEdges: [],
        distances: {},
        path: [],
        totalWeight: 0,
        error: `Unsupported graph algorithm: ${request.algorithm}`,
      };
  }
}