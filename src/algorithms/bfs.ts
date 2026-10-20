// src/algorithms/bfs.ts

import type {
  Edge,
  GraphRequest,
  GraphResult,
  GraphStep,
} from "../types";

export function bfs(request: GraphRequest): GraphResult {
  const { nodes, edges, startNode, endNode, directed } = request;

  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const queue: string[] = [];
  const distances: Record<string, number> = {};

  for (const node of nodes) {
    distances[node] = Infinity;
  }

  const fail = (message: string): GraphResult => ({
    algorithm: "bfs",
    steps: [
      makeStep(1, "error", message, message, {
        visitedNodes: [],
        queue: [],
        stack: [],
        distances,
        selectedEdges: [],
        totalWeight: 0,
      }),
    ],
    visitedOrder: [],
    selectedEdges: [],
    distances,
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
  for (const node of nodes) adjacency.set(node, []);

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

  const parent: Record<string, string | undefined> = {};
  const selectedEdges: Edge[] = [];

  distances[startNode] = 0;
  queue.push(startNode);

  steps.push(makeStep(
    steps.length + 1,
    "start",
    `Start BFS from ${startNode}.`,
    "Breadth-first search explores the graph level by level using a FIFO queue.",
    { currentNode: startNode, visitedNodes: [], queue, stack: [], distances,
      selectedEdges, totalWeight: 0, sourceLine: 1 },
  ));

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current)) continue;

    visited.add(current);
    visitedOrder.push(current);

    steps.push(makeStep(
      steps.length + 1,
      "visit",
      `Visit node ${current}.`,
      `Remove ${current} from the front of the queue and mark it visited.`,
      { currentNode: current, visitedNodes: [...visitedOrder], queue: [...queue],
        stack: [], distances: { ...distances }, selectedEdges: [...selectedEdges],
        totalWeight: selectedEdges.reduce((sum, edge) => sum + edge.weight, 0),
        sourceLine: 2 },
    ));

    if (current === endNode) break;

    for (const edge of adjacency.get(current) ?? []) {
      const neighbor = edge.to;

      steps.push(makeStep(
        steps.length + 1,
        "compare",
        `Examine edge ${current} → ${neighbor}.`,
        `Check whether ${neighbor} has already been discovered.`,
        { currentNode: current, edgeFrom: current, edgeTo: neighbor,
          activeEdge: edge, visitedNodes: [...visitedOrder], queue: [...queue],
          stack: [], distances: { ...distances }, selectedEdges: [...selectedEdges],
          totalWeight: selectedEdges.reduce((sum, item) => sum + item.weight, 0),
          sourceLine: 3 },
      ));

      if (distances[neighbor] !== Infinity) continue;

      distances[neighbor] = distances[current] + 1;
      parent[neighbor] = current;
      queue.push(neighbor);

      selectedEdges.push(edge);

      steps.push(makeStep(
        steps.length + 1,
        "enqueue",
        `Discover ${neighbor} and add it to the queue.`,
        `The node is discovered for the first time. Its BFS distance is ${distances[neighbor]} edge(s) from ${startNode}.`,
        { currentNode: neighbor, node: neighbor, edgeFrom: current, edgeTo: neighbor,
          activeEdge: edge, visitedNodes: [...visitedOrder], queue: [...queue],
          stack: [], distances: { ...distances }, selectedEdges: [...selectedEdges],
          totalWeight: selectedEdges.reduce((sum, item) => sum + item.weight, 0),
          sourceLine: 4 },
      ));
    }
  }

  const path: string[] = [];
  if (endNode && distances[endNode] !== Infinity) {
    let current: string | undefined = endNode;

    while (current) {
      path.unshift(current);
      current = parent[current];
    }
  }

  const result: GraphResult = {
    algorithm: "bfs",
    steps,
    visitedOrder,
    selectedEdges,
    distances: { ...distances },
    path,
    totalWeight: selectedEdges.reduce((sum, edge) => sum + edge.weight, 0),
  };

  steps.push(makeStep(
    steps.length + 1,
    "complete",
    "BFS completed.",
    endNode
      ? path.length
        ? `Found a path from ${startNode} to ${endNode}. BFS minimizes the number of edges, not their weights.`
        : `No path exists from ${startNode} to ${endNode}.`
      : `Traversal finished after visiting ${visitedOrder.length} node(s).`,
    { currentNode: visitedOrder[visitedOrder.length - 1], visitedNodes: [...visitedOrder],
      queue: [], stack: [], distances: { ...distances },
      selectedEdges: [...selectedEdges],
      totalWeight: selectedEdges.reduce((sum, edge) => sum + edge.weight, 0),
      sourceLine: 5 },
  ));

  return result;
}

function makeStep(
  stepNumber: number,
  action: GraphStep["action"],
  message: string,
  explanation: string,
  state: Omit<GraphStep, "stepNumber" | "action" | "message" | "explanation">,
): GraphStep {
  return {
    stepNumber, action, message, explanation,
    currentNode: state.currentNode,
    node: state.node,
    edgeFrom: state.edgeFrom,
    edgeTo: state.edgeTo,
    activeEdge: state.activeEdge,
    visitedNodes: state.visitedNodes ?? [],
    visited: state.visited ?? state.visitedNodes ?? [],
    queue: state.queue ?? [],
    stack: state.stack ?? [],
    distances: state.distances ?? {},
    distanceSnapshot: state.distanceSnapshot,
    distance: state.distance,
    selectedEdges: state.selectedEdges ?? [],
    totalWeight: state.totalWeight ?? 0,
    sourceLine: state.sourceLine,
  };
}