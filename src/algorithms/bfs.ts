// src/algorithms/bfs.ts

import type { Edge, GraphRequest, GraphResult, GraphStep } from "../types";
import { validateGraphInput } from "./validation";

export const bfsSource = {
  typescript: `function bfs(graph, start, destination) {
  const queue = [start];
  const visited = new Set([start]);
  const previous = new Map();

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === destination) break;

    for (const edge of graph[current]) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      previous.set(edge.to, current);
      queue.push(edge.to);
    }
  }

  return { visited, previous };
}`,
  cpp: `void bfs(vector<vector<int>>& graph, int start) {
  queue<int> q;
  vector<bool> visited(graph.size(), false);
  visited[start] = true;
  q.push(start);

  while (!q.empty()) {
    int node = q.front();
    q.pop();

    for (int next : graph[node]) {
      if (!visited[next]) {
        visited[next] = true;
        q.push(next);
      }
    }
  }
}`,
  python: `from collections import deque

def bfs(graph, start):
    queue = deque([start])
    visited = {start}
    previous = {}

    while queue:
        current = queue.popleft()
        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                previous[neighbor] = current
                queue.append(neighbor)

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

export function runBfs(graph: GraphRequest): GraphResult {
  const errors = validateGraphInput("bfs", graph);
  if (errors.length) throw new Error(errors.join(" "));

  const adjacency = makeAdjacency(graph);
  const queue = [graph.startNode];
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
      queue: [...queue],
      stack: [],
      distances: { ...distances },
      selectedEdges: selectedEdges.map((edge) => ({ ...edge })),
      totalWeight: 0,
      sourceLine: 1,
      ...extra,
    });
  };

  record("start", `Start BFS at ${graph.startNode}.`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    visitedNodes.push(current);

    record("visit", `Dequeue and visit ${current}.`, {
      currentNode: current,
      sourceLine: 5,
    });

    if (current === graph.endNode) break;

    for (const edge of adjacency.get(current) ?? []) {
      if (visited.has(edge.to)) continue;

      visited.add(edge.to);
      previous.set(edge.to, current);
      distances[edge.to] = distances[current] + 1;
      selectedEdges.push(edge);
      queue.push(edge.to);

      record("enqueue", `Discover ${edge.to} and enqueue it.`, {
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
        ? `BFS found a path of ${path.length - 1} edges.`
        : `No path exists to ${graph.endNode}.`
      : "BFS traversal finished.",
    { sourceLine: 14 },
  );

  return {
    algorithm: "bfs",
    steps,
    visitedOrder: visitedNodes,
    selectedEdges,
    distances,
    path,
    totalWeight: 0,
  };
}