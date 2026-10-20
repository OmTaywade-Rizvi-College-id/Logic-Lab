// src/algorithms/createGraph.ts

import type {
  Edge,
  GraphAlgorithmId,
  GraphRequest,
} from "../types";

export function createGraph(
  nodeCount: number,
  edges: Edge[] = [],
  source?: string,
  destination?: string,
  undirected = true,
  algorithm: GraphAlgorithmId = "dijkstra",
): GraphRequest {
  if (
    !Number.isInteger(nodeCount) ||
    nodeCount < 1 ||
    nodeCount > 100
  ) {
    throw new Error("Node count must be an integer from 1 to 100.");
  }

  const nodes = Array.from({ length: nodeCount }, (_, index) =>
    index < 26 ? String.fromCharCode(65 + index) : `N${index + 1}`,
  );

  const startNode =
    source && nodes.includes(source) ? source : nodes[0];

  const endNode =
    destination && nodes.includes(destination)
      ? destination
      : nodes[Math.min(1, nodes.length - 1)];

  return {
    algorithm,
    nodes,
    edges: edges.map((edge) => ({ ...edge })),
    startNode,
    endNode,
    directed: algorithm === "prim" ? false : !undirected,
  };
}