// src/algorithms/graphAlgorithms.ts

import type {
  GraphAlgorithmId,
  GraphRequest,
  GraphResult,
} from "../types";

import { validateGraphInput } from "./validation";
import { runDijkstra } from "./dijkstra";
import { runBfs } from "./bfs";
import { runDfs } from "./dfs";
import { runPrim } from "./prim";

export function runGraphAlgorithm(
  algorithm: GraphAlgorithmId,
  request: Omit<GraphRequest, "algorithm">,
): GraphResult {
  const fullRequest: GraphRequest = {
    ...request,
    algorithm,
  };

  const errors = validateGraphInput(algorithm, fullRequest);

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  switch (algorithm) {
    case "dijkstra":
      return runDijkstra(fullRequest);

    case "bfs":
      return runBfs(fullRequest);

    case "dfs":
      return runDfs(fullRequest);

    case "prim":
      return runPrim(fullRequest);

    default: {
      const exhaustive: never = algorithm;
      throw new Error(`Unsupported graph algorithm: ${exhaustive}`);
    }
  }
}