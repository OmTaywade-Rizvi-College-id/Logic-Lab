// src/algorithms/dfs.ts

import type { Edge, GraphRequest, GraphResult, GraphStep } from "../types";

export function dfs(request: GraphRequest): GraphResult {
  const { nodes, edges, startNode, endNode, directed } = request;
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const stack: string[] = [];
  const distances: Record<string, number> = {};
  const parent: Record<string, string | undefined> = {};
  const selectedEdges: Edge[] = [];

  nodes.forEach((node) => { distances[node] = Infinity; });

  const makeStep = (
    action: GraphStep["action"],
    message: string,
    explanation: string,
    state: Partial<GraphStep> = {},
  ): GraphStep => ({
    stepNumber: steps.length + 1,
    action,
    message,
    explanation,
    visitedNodes: [...visitedOrder],
    visited: [...visitedOrder],
    queue: [],
    stack: [...stack],
    distances: { ...distances },
    selectedEdges: [...selectedEdges],
    totalWeight: selectedEdges.reduce((sum, edge) => sum + edge.weight, 0),
    ...state,
  });

  const fail = (message: string): GraphResult => ({
    algorithm: "dfs",
    steps: [makeStep("error", message, message)],
    visitedOrder: [],
    selectedEdges: [],
    distances: { ...distances },
    path: [],
    totalWeight: 0,
    error: message,
  });

  if (!nodes.includes(startNode)) {
    return fail(`Start node "${startNode}" does not exist.`);
  }

  if (endNode && !nodes.includes(endNode)) {
    return fail(`Destination node "${endNode}" does not exist.`);
  }

  const adjacency = new Map<string, Edge[]>();
  nodes.forEach((node) => adjacency.set(node, []));

  for (const edge of edges) {
    if (!adjacency.has(edge.from) || !adjacency.has(edge.to)) {
      return fail(`Edge ${edge.from} → ${edge.to} contains an unknown node.`);
    }

    adjacency.get(edge.from)!.push(edge);

    if (!directed) {
      adjacency.get(edge.to)!.push({
        from: edge.to,
        to: edge.from,
        weight: edge.weight,
      });
    }
  }

  distances[startNode] = 0;
  stack.push(startNode);
  steps.push(makeStep(
    "start",
    `Start DFS from ${startNode}.`,
    "Depth-first search uses a last-in, first-out stack to explore a branch before backtracking.",
    { currentNode: startNode, sourceLine: 1 },
  ));

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) continue;

    visited.add(current);
    visitedOrder.push(current);

    steps.push(makeStep(
      "visit",
      `Visit node ${current}.`,
      `Pop ${current} from the stack and mark it as visited.`,
      { currentNode: current, sourceLine: 2 },
    ));

    if (current === endNode) break;

    const neighbors = adjacency.get(current) ?? [];

    // Reverse push order so the first listed neighbor is processed first.
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const edge = neighbors[i];
      const neighbor = edge.to;

      steps.push(makeStep(
        "compare",
        `Examine edge ${current} → ${neighbor}.`,
        `Check whether ${neighbor} has already been visited.`,
        { currentNode: current, edgeFrom: current, edgeTo: neighbor,
          activeEdge: edge, sourceLine: 3 },
      ));

      if (visited.has(neighbor)) continue;

      if (!stack.includes(neighbor)) {
        parent[neighbor] = current;
        distances[neighbor] = distances[current] + 1;
        stack.push(neighbor);
        selectedEdges.push(edge);

        steps.push(makeStep(
          "push",
          `Push ${neighbor} onto the stack.`,
          `Add ${neighbor} for later exploration. Its discovery depth is ${distances[neighbor]}.`,
          { currentNode: neighbor, node: neighbor, edgeFrom: current,
            edgeTo: neighbor, activeEdge: edge, sourceLine: 4 },
        ));
      }
    }
  }

  const path: string[] = [];
  if (endNode && visited.has(endNode)) {
    let current: string | undefined = endNode;
    while (current) {
      path.unshift(current);
      current = parent[current];
    }
  }

  const totalWeight = selectedEdges.reduce((sum, edge) => sum + edge.weight, 0);

  steps.push(makeStep(
    "complete",
    "DFS completed.",
    endNode
      ? path.length
        ? `A traversal path from ${startNode} to ${endNode} was found. DFS does not guarantee the shortest path.`
        : `No path exists from ${startNode} to ${endNode}.`
      : `Traversal finished after visiting ${visitedOrder.length} node(s).`,
    { currentNode: visitedOrder[visitedOrder.length - 1], sourceLine: 5 },
  ));

  return {
    algorithm: "dfs",
    steps,
    visitedOrder,
    selectedEdges,
    distances: { ...distances },
    path,
    totalWeight,
  };
}