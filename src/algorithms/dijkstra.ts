// src/algorithms/dijkstra.ts

import type { Edge, GraphRequest, GraphResult, GraphStep } from "../types";

export function dijkstra(request: GraphRequest): GraphResult {
  const { nodes, edges, startNode, endNode, directed } = request;
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const selectedEdges: Edge[] = [];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | undefined> = {};

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
    stack: [],
    distances: { ...distances },
    distanceSnapshot: { ...distances },
    selectedEdges: [...selectedEdges],
    totalWeight: selectedEdges.reduce((sum, edge) => sum + edge.weight, 0),
    ...state,
  });

  const fail = (message: string): GraphResult => ({
    algorithm: "dijkstra",
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

  if (edges.some((edge) => !Number.isFinite(edge.weight) || edge.weight < 0)) {
    return fail("Dijkstra requires finite, non-negative edge weights.");
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

  steps.push(makeStep(
    "start",
    `Start Dijkstra from ${startNode}.`,
    "Set the source distance to zero and every other distance to infinity.",
    { currentNode: startNode, sourceLine: 1 },
  ));

  while (visited.size < nodes.length) {
    let current: string | undefined;
    let minimum = Infinity;

    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < minimum) {
        minimum = distances[node];
        current = node;
      }
    }

    if (current === undefined) break;

    visited.add(current);
    visitedOrder.push(current);

    steps.push(makeStep(
      "visit",
      `Visit ${current} with distance ${distances[current]}.`,
      `Choose the unvisited node with the smallest known distance (${distances[current]}).`,
      { currentNode: current, distance: distances[current], sourceLine: 2 },
    ));

    if (current === endNode) {
      steps.push(makeStep(
        "complete",
        `Destination ${endNode} reached.`,
        "Because this is the smallest unvisited distance, its shortest distance is finalized.",
        { currentNode: current, sourceLine: 3 },
      ));
      break;
    }

    for (const edge of adjacency.get(current) ?? []) {
      const neighbor = edge.to;

      steps.push(makeStep(
        "compare",
        `Check edge ${current} → ${neighbor} (weight ${edge.weight}).`,
        `Compare the current distance to ${neighbor} with ${distances[current]} + ${edge.weight}.`,
        { currentNode: current, edgeFrom: current, edgeTo: neighbor,
          activeEdge: edge, distance: distances[neighbor], sourceLine: 4 },
      ));

      if (visited.has(neighbor)) continue;

      const candidate = distances[current] + edge.weight;

      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;
        previous[neighbor] = current;

        steps.push(makeStep(
          "relax",
          `Update distance of ${neighbor} to ${candidate}.`,
          `The route through ${current} is shorter. Set distance(${neighbor}) = ${candidate}.`,
          { currentNode: neighbor, edgeFrom: current, edgeTo: neighbor,
            activeEdge: edge, distance: candidate, sourceLine: 5 },
        ));
      }
    }
  }

  const path: string[] = [];
  if (endNode && Number.isFinite(distances[endNode])) {
    let current: string | undefined = endNode;

    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    for (let i = 0; i < path.length - 1; i++) {
      const edge = adjacency.get(path[i])?.find(
        (item) => item.to === path[i + 1],
      );
      if (edge) selectedEdges.push(edge);
    }
  }

  const totalWeight = selectedEdges.reduce((sum, edge) => sum + edge.weight, 0);

  steps.push(makeStep(
    "complete",
    "Dijkstra completed.",
    endNode
      ? Number.isFinite(distances[endNode])
        ? `Shortest path: ${path.join(" → ")}. Total weight: ${distances[endNode]}.`
        : `Destination ${endNode} is unreachable from ${startNode}.`
      : "All reachable nodes have been processed.",
    { currentNode: visitedOrder[visitedOrder.length - 1], sourceLine: 6 },
  ));

  return {
    algorithm: "dijkstra",
    steps,
    visitedOrder,
    selectedEdges,
    distances: { ...distances },
    path,
    totalWeight: endNode && Number.isFinite(distances[endNode])
      ? distances[endNode]
      : totalWeight,
  };
}