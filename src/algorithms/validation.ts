// src/algorithms/validation.ts

import type { GraphRequest, SortingRequest } from "../types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGraphRequest(
  request: GraphRequest,
): ValidationResult {
  const errors: string[] = [];
  const nodeSet = new Set(request.nodes);

  if (request.nodes.length === 0) {
    errors.push("The graph must contain at least one node.");
  }

  if (nodeSet.size !== request.nodes.length) {
    errors.push("Node IDs must be unique.");
  }

  if (!nodeSet.has(request.startNode)) {
    errors.push(`Start node "${request.startNode}" does not exist.`);
  }

  if (
    request.endNode !== undefined &&
    !nodeSet.has(request.endNode)
  ) {
    errors.push(`Destination node "${request.endNode}" does not exist.`);
  }

  for (const edge of request.edges) {
    if (!nodeSet.has(edge.from) || !nodeSet.has(edge.to)) {
      errors.push(
        `Edge ${edge.from} → ${edge.to} references an unknown node.`,
      );
    }

    if (!Number.isFinite(edge.weight)) {
      errors.push(
        `Edge ${edge.from} → ${edge.to} must have a finite weight.`,
      );
    }

    if (
      request.algorithm === "dijkstra" &&
      edge.weight < 0
    ) {
      errors.push("Dijkstra does not support negative edge weights.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSortingRequest(
  request: SortingRequest,
): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(request.values)) {
    errors.push("Sorting values must be an array.");
  } else if (
    request.values.some((value) => !Number.isFinite(value))
  ) {
    errors.push("Every sorting value must be a finite number.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}