// src/algorithms/prim.ts

import type { Edge, GraphRequest, GraphResult, GraphStep } from "../types";

export function prim(request: GraphRequest): GraphResult {
  const { nodes, edges, startNode } = request;
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const selectedEdges: Edge[] = [];
  const distances: Record<string, number> = {};

  nodes.forEach((node) => { distances[node] = Infinity; });

  let totalWeight = 0;

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
    totalWeight,
    ...state,
  });

  const fail = (message: string): GraphResult => ({
    algorithm: "prim",
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

  if (edges.some((edge) => !Number.isFinite(edge.weight))) {
    return fail("All edge weights must be finite numbers.");
  }

  for (const edge of edges) {
    if (!nodes.includes(edge.from) || !nodes.includes(edge.to)) {
      return fail(`Edge ${edge.from} → ${edge.to} contains an unknown node.`);
    }
  }

  const adjacency = new Map<string, Edge[]>();
  nodes.forEach((node) => adjacency.set(node, []));

  for (const edge of edges) {
    adjacency.get(edge.from)!.push(edge);
    adjacency.get(edge.to)!.push({
      from: edge.to,
      to: edge.from,
      weight: edge.weight,
    });
  }

  steps.push(makeStep(
    "start",
    `Start Prim from ${startNode}.`,
    "Begin with the selected start node. At each step, choose the lowest-weight edge connecting the tree to an unvisited node.",
    { currentNode: startNode, sourceLine: 1 },
  ));

  const roots = [startNode, ...nodes.filter((node) => node !== startNode)];

  for (const root of roots) {
    if (visited.has(root)) continue;

    visited.add(root);
    visitedOrder.push(root);

    steps.push(makeStep(
      "visit",
      `Add node ${root} to the tree.`,
      visitedOrder.length === 1
        ? "The first node starts the minimum spanning tree."
        : `Node ${root} begins another component because the graph is disconnected.`,
      { currentNode: root, sourceLine: 2 },
    ));

    while (true) {
      let best: Edge | undefined;

      for (const from of visited) {
        for (const edge of adjacency.get(from) ?? []) {
          if (visited.has(edge.to)) continue;

          steps.push(makeStep(
            "compare",
            `Consider edge ${edge.from} — ${edge.to} (weight ${edge.weight}).`,
            "Only edges crossing from a visited node to an unvisited node can extend the tree.",
            { currentNode: from, edgeFrom: edge.from, edgeTo: edge.to,
              activeEdge: edge, sourceLine: 3 },
          ));

          if (!best || edge.weight < best.weight) best = edge;
        }
      }

      if (!best) break;

      selectedEdges.push(best);
      totalWeight += best.weight;
      visited.add(best.to);
      visitedOrder.push(best.to);
      distances[best.to] = best.weight;

      steps.push(makeStep(
        "select-edge",
        `Select ${best.from} — ${best.to} (weight ${best.weight}).`,
        `This is the minimum-weight edge connecting the current tree to an unvisited node. Total weight is now ${totalWeight}.`,
        { currentNode: best.to, edgeFrom: best.from, edgeTo: best.to,
          activeEdge: best, sourceLine: 4 },
      ));

      steps.push(makeStep(
        "visit",
        `Add node ${best.to} to the tree.`,
        `Node ${best.to} is now part of the current spanning tree.`,
        { currentNode: best.to, sourceLine: 5 },
      ));
    }
  }

  steps.push(makeStep(
    "complete",
    "Prim completed.",
    `Selected ${selectedEdges.length} edge(s) with total weight ${totalWeight}.`,
    { currentNode: visitedOrder[visitedOrder.length - 1], sourceLine: 6 },
  ));

  return {
    algorithm: "prim",
    steps,
    visitedOrder,
    selectedEdges,
    distances: { ...distances },
    path: [],
    totalWeight,
  };
}