// src/algorithms/dfs.ts

import type { Edge, GraphRequest, GraphResult, GraphStep } from "../types";
import { validateGraphInput } from "./validation";

export const dfsSource = {
  typescript: `function dfs(graph, start, destination) {
  const stack = [start];
  const visited = new Set([start]);
  const previous = new Map();

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === destination) break;

    for (const edge of [...graph[current]].reverse()) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      previous.set(edge.to, current);
      stack.push(edge.to);
    }
  }

  return { visited, previous };
}`,
  cpp: `void dfs(vector<vector<int>>& graph, int start) {
  stack<int> s;
  vector<bool> visited(graph.size(), false);
  s.push(start);

  while (!s.empty()) {
    int node = s.top();
    s.pop();
    if (visited[node]) continue;
    visited[node] = true;

    for (int next : graph[node]) {
      if (!visited[next]) s.push(next);
    }
  }
}`,
  python: `def dfs(graph, start):
    stack = [start]
    visited = {start}
    previous = {}

    while stack:
        current = stack.pop()
        for neighbor in reversed(graph[current]):
            if neighbor not in visited:
                visited.add(neighbor)
                previous[neighbor] = current
                stack.append(neighbor)

    return visited, previous`,
};

function makeAdjacency(graph: GraphRequest): Map<string, Edge[]> {
  const adjacency = new Map<string, Edge[]>();
  graph.nodes.forEach((node) => adjacency.set(node, []));

  for (const edge of graph.edges) {
    adjacency.get(edge.from)!.push(edge);

    if (!graph.directed) {
      adjacency.get(edge.to)!.push({
        from: edge.to,
        to: edge.from,
        weight: edge.weight,
      });
    }
  }

  for (const edges of adjacency.values()) {
    edges.sort((a, b) => a.to.localeCompare(b.to));
  }

  return adjacency;
}

export function runDfs(graph: GraphRequest): GraphResult {
  const errors = validateGraphInput("dfs", graph);
  if (errors.length) throw new Error(errors.join(" "));

  const adjacency = makeAdjacency(graph);
  const stack = [graph.startNode];
  const visited = new Set<string>([graph.startNode]);
  const visitedNodes: string[] = [];
  const previous = new Map<string, string>();
  const distances: Record<string, number> = Object.fromEntries(
    graph.nodes.map((node) => [node, Infinity]),
  );
  const selectedEdges: Edge[] = [];
  const steps: GraphStep[] = [];

  distances[graph.startNode] = 0;

  const record = (
    action: GraphStep["action"],
    message: string,
    extra: Partial<GraphStep> = {},
  ) => {
    steps.push({
      stepNumber: steps.length,
      action,
      message,
      explanation: message,
      visitedNodes: [...visitedNodes],
      queue: [],
      stack: [...stack],
      distances: { ...distances },
      selectedEdges: selectedEdges.map((edge) => ({ ...edge })),
      totalWeight: 0,
      sourceLine: 1,
      ...extra,
    });
  };

  record("start", `Start DFS at ${graph.startNode}.`);

  while (stack.length > 0) {
    const current = stack.pop()!;

    visitedNodes.push(current);

    record("visit", `Pop and visit ${current}.`, {
      currentNode: current,
      sourceLine: 5,
    });

    if (current === graph.endNode) break;

    const neighbors = [...(adjacency.get(current) ?? [])].reverse();

    for (const edge of neighbors) {
      if (visited.has(edge.to)) continue;

      visited.add(edge.to);
      previous.set(edge.to, current);
      distances[edge.to] = distances[current] + 1;
      selectedEdges.push(edge);
      stack.push(edge.to);

      record("push", `Push ${edge.to} onto the stack.`, {
        currentNode: current,
        edgeFrom: edge.from,
        edgeTo: edge.to,
        activeEdge: edge,
        sourceLine: 10,
      });
    }
  }

  const path: string[] = [];

  if (graph.endNode && visited.has(graph.endNode)) {
    let current: string | undefined = graph.endNode;

    while (current !== undefined) {
      path.push(current);
      if (current === graph.startNode) break;
      current = previous.get(current);
    }

    path.reverse();
  }

  record(
    "complete",
    graph.endNode
      ? path.length
        ? `DFS found a path containing ${path.length - 1} edges.`
        : `No path exists to ${graph.endNode}.`
      : "DFS traversal finished.",
    { sourceLine: 14 },
  );

  return {
    algorithm: "dfs",
    steps,
    visitedOrder: visitedNodes,
    selectedEdges,
    distances,
    path,
    totalWeight: 0,
  };
}