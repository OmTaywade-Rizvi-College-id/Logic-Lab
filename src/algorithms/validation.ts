import type {
  GraphAlgorithmId,
  GraphRequest,
  SortingAlgorithmId,
} from "../types";

export function validateSortingInput(
  algorithm: SortingAlgorithmId,
  values: number[],
): string[] {
  const errors: string[] = [];

  if (!Array.isArray(values)) {
    return ["Input must be an array of numbers."];
  }

  if (values.length > 100) {
    errors.push("Maximum 100 values are allowed.");
  }

  if (
    values.some(
      (value) =>
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        !Number.isSafeInteger(value),
    )
  ) {
    errors.push("All values must be finite safe integers.");
  }

  if (
    !["selectionSort", "insertionSort", "quickSort"].includes(algorithm)
  ) {
    errors.push("Unsupported sorting algorithm.");
  }

  return errors;
}

export function validateGraphInput(
  algorithm: GraphAlgorithmId,
  graph: GraphRequest,
): string[] {
  const errors: string[] = [];

  if (
    !graph ||
    !Array.isArray(graph.nodes) ||
    !Array.isArray(graph.edges)
  ) {
    return ["Graph input must contain nodes and edges arrays."];
  }

  const { nodes, edges, startNode, endNode, directed = false } = graph;

  if (nodes.length === 0) errors.push("Add at least one node.");
  if (nodes.length > 100) errors.push("Maximum 100 nodes are allowed.");
  if (edges.length > 500) errors.push("Maximum 500 edges are allowed.");

  if (
    nodes.some(
      (node) => typeof node !== "string" || node.trim().length === 0,
    )
  ) {
    errors.push("Every node must have a non-empty string ID.");
  }

  if (new Set(nodes).size !== nodes.length) {
    errors.push("Node IDs must be unique.");
  }

  const nodeSet = new Set(nodes);

  if (!nodeSet.has(startNode)) {
    errors.push("The starting node does not exist.");
  }

  if (endNode !== undefined && !nodeSet.has(endNode)) {
    errors.push("The destination node does not exist.");
  }

  const seenEdges = new Set<string>();

  for (const edge of edges) {
    if (
      !edge ||
      !nodeSet.has(edge.from) ||
      !nodeSet.has(edge.to)
    ) {
      errors.push("Every edge must connect existing nodes.");
      continue;
    }

    if (edge.from === edge.to) {
      errors.push(`Self-loop at ${edge.from} is not supported.`);
    }

    if (!Number.isFinite(edge.weight)) {
      errors.push("Edge weights must be finite numbers.");
    }

    const key = directed
      ? `${edge.from}->${edge.to}`
      : [edge.from, edge.to].sort().join("--");

    if (seenEdges.has(key)) {
      errors.push(`Duplicate edge detected: ${edge.from} → ${edge.to}.`);
    }

    seenEdges.add(key);
  }

  if (
    algorithm === "dijkstra" &&
    edges.some((edge) => edge.weight < 0)
  ) {
    errors.push("Dijkstra cannot process negative edge weights.");
  }

  if (algorithm === "prim" && directed) {
    errors.push("Prim requires an undirected graph.");
  }

  return [...new Set(errors)];
}    