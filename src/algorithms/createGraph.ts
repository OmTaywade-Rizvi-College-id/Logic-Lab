// src/algorithms/createGraph.ts

import type { Edge } from "../types";

export interface GraphNode {
  id: string;
  neighbors: Edge[];
}

export interface Graph {
  nodes: string[];
  edges: Edge[];
  adjacency: Record<string, Edge[]>;
  directed: boolean;
}

export function createGraph(
  nodes: string[],
  edges: Edge[],
  directed: boolean,
): Graph {
  const adjacency: Record<string, Edge[]> = {};

  for (const node of nodes) {
    adjacency[node] = [];
  }

  for (const edge of edges) {
    if (!adjacency[edge.from] || !adjacency[edge.to]) {
      throw new Error(
        `Invalid edge: ${edge.from} → ${edge.to}. Node does not exist.`,
      );
    }

    adjacency[edge.from].push(edge);

    if (!directed) {
      adjacency[edge.to].push({
        from: edge.to,
        to: edge.from,
        weight: edge.weight,
      });
    }
  }

  return {
    nodes: [...nodes],
    edges: [...edges],
    adjacency,
    directed,
  };
}