// src/algorithms/dijkstra.ts

import type { Edge, GraphRequest, GraphResult, GraphStep } from "../types";
import { validateGraphInput } from "./validation";

export const dijkstraSource = {
  typescript: `function dijkstra(graph, start, destination) {
  const distances = initializeDistances(graph, Infinity);
  const previous = new Map();
  const visited = new Set();
  distances[start] = 0;

  while (true) {
    const current = nearestUnvisited(distances, visited);
    if (current === undefined) break;

    visited.add(current);
    if (current === destination) break;

    for (const edge of graph[current]) {
      const candidate = distances[current] + edge.weight;
      if (candidate < distances[edge.to]) {
        distances[edge.to] = candidate;
        previous.set(edge.to, current);
      }
    }
  }

  return { distances, previous };
}`,
  cpp: `// Dijkstra using a min-priority queue.
// All edge weights must be non-negative.
vector<int> dijkstra(Graph& graph, int start) {
  vector<int> dist(graph.size(), INF);
  priority_queue<pair<int,int>,
    vector<pair<int,int>>, greater<>> pq;
  dist[start] = 0;
  pq.push({0, start});

  while (!pq.empty()) {
    auto [cost, node] = pq.top();
    pq.pop();
    if (cost != dist[node]) continue;

    for (auto [next, weight] : graph[node]) {
      if (cost + weight < dist[next]) {
        dist[next] = cost + weight;
        pq.push({dist[next], next});
      }
    }
  }
  return dist;
}`,
  python: `import heapq

def dijkstra(graph, start):
    distances = {node: float("inf") for node in graph}
    distances[start] = 0
    previous = {}
    heap = [(0, start)]

    while heap:
        cost, node = heapq.heappop(heap)
        if cost != distances[node]:
            continue

        for neighbor, weight in graph[node]:
            candidate = cost + weight
            if candidate < distances[neighbor]:
                distances[neighbor] = candidate
                previous[neighbor] = node
                heapq.heappush(heap, (candidate, neighbor))

    return distances, previous`,
};

function buildAdjacency(graph: GraphRequest): Map<string, Edge[]> {
  const adjacency = new Map<string, Edge[]>();

  for (const node of graph.nodes) adjacency.set(node, []);

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

export function runDijkstra(graph: GraphRequest): GraphResult {
  const errors = validateGraphInput("dijkstra", graph);
  if (errors.length) throw new Error(errors.join(" "));

  const adjacency = buildAdjacency(graph);
  const distances: Record<string, number> = Object.fromEntries(
    graph.nodes.map((node) => [node, Infinity]),
  );

  distances[graph.startNode] = 0;

  const visited = new Set<string>();
  const previous = new Map<string, string>();
  const steps: GraphStep[] = [];
  const visitedNodes: string[] = [];
  const selectedEdges: Edge[] = [];

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
      stack: [],
      distances: { ...distances },
      selectedEdges: selectedEdges.map((edge) => ({ ...edge })),
      totalWeight: 0,
      sourceLine: 1,
      ...extra,
    });
  };

  record("start", `Start Dijkstra at ${graph.startNode}.`);

  while (true) {
    let current: string | undefined;
    let bestDistance = Infinity;

    for (const node of graph.nodes) {
      if (!visited.has(node) && distances[node] < bestDistance) {
        current = node;
        bestDistance = distances[node];
      }
    }

    // Remaining nodes are unreachable.
    if (current === undefined) break;

    visited.add(current);
    visitedNodes.push(current);

    record("visit", `Visit ${current}, distance ${distances[current]}.`, {
      currentNode: current,
      sourceLine: 7,
    });

    if (current === graph.endNode) break;

    for (const edge of adjacency.get(current) ?? []) {
      if (visited.has(edge.to)) continue;

      record("compare", `Check edge ${current} → ${edge.to}.`, {
        currentNode: current,
        edgeFrom: edge.from,
        edgeTo: edge.to,
        activeEdge: edge,
        sourceLine: 10,
      });

      const candidate = distances[current] + edge.weight;

      if (candidate < distances[edge.to]) {
        distances[edge.to] = candidate;
        previous.set(edge.to, current);

        record("relax", `Update distance of ${edge.to} to ${candidate}.`, {
          currentNode: current,
          edgeFrom: edge.from,
          edgeTo: edge.to,
          activeEdge: edge,
          sourceLine: 11,
        });
      }
    }
  }

  const path: string[] = [];
  if (graph.endNode && Number.isFinite(distances[graph.endNode])) {
    let node: string | undefined = graph.endNode;

    while (node !== undefined) {
      path.push(node);
      if (node === graph.startNode) break;
      node = previous.get(node);
    }

    path.reverse();
  }

  record(
    "complete",
    graph.endNode
      ? path.length > 0
        ? `Shortest path cost: ${distances[graph.endNode]}.`
        : `No path exists to ${graph.endNode}.`
      : "Shortest distances calculated.",
    { sourceLine: 15 },
  );

  return {
    algorithm: "dijkstra",
    steps,
    visitedOrder: visitedNodes,
    selectedEdges,
    distances,
    path,
    totalWeight: 0,
  };
}