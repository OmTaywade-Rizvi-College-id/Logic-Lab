// src/algorithms/prim.ts

import type { Edge, GraphRequest, GraphResult, GraphStep } from "../types";
import { validateGraphInput } from "./validation";

export const primSource = {
  typescript: `function prim(graph, start) {
  const visited = new Set([start]);
  const selectedEdges = [];
  let totalWeight = 0;

  while (visited.size < graph.nodes.length) {
    let bestEdge;

    for (const node of visited) {
      for (const edge of graph[node]) {
        if (visited.has(edge.to)) continue;
        if (!bestEdge || edge.weight < bestEdge.weight) {
          bestEdge = edge;
        }
      }
    }

    if (!bestEdge) break;

    visited.add(bestEdge.to);
    selectedEdges.push(bestEdge);
    totalWeight += bestEdge.weight;
  }

  return { selectedEdges, totalWeight };
}`,
  cpp: `// Prim's algorithm for an undirected weighted graph.
long long prim(vector<vector<pair<int,int>>>& graph, int start) {
  vector<bool> visited(graph.size(), false);
  priority_queue<tuple<int,int,int>,
    vector<tuple<int,int,int>>, greater<>> pq;
  pq.push({0, start, -1});
  long long totalWeight = 0;

  while (!pq.empty()) {
    auto [weight, node, parent] = pq.top();
    pq.pop();
    if (visited[node]) continue;
    visited[node] = true;
    totalWeight += parent == -1 ? 0 : weight;

    for (auto [next, w] : graph[node]) {
      if (!visited[next]) pq.push({w, next, node});
    }
  }
  return totalWeight;
}`,
  python: `import heapq

def prim(graph, start):
    visited = {start}
    heap = [(weight, start, neighbor)
            for neighbor, weight in graph[start]]
    heapq.heapify(heap)
    selected_edges = []
    total_weight = 0

    while heap and len(visited) < len(graph):
        weight, parent, node = heapq.heappop(heap)
        if node in visited:
            continue
        visited.add(node)
        selected_edges.append((parent, node, weight))
        total_weight += weight
        for neighbor, next_weight in graph[node]:
            if neighbor not in visited:
                heapq.heappush(heap, (next_weight, node, neighbor))

    return selected_edges, total_weight`,
};

function buildAdjacency(graph: GraphRequest): Map<string, Edge[]> {
  const adjacency = new Map<string, Edge[]>();
  graph.nodes.forEach((node) => adjacency.set(node, []));

  for (const edge of graph.edges) {
    adjacency.get(edge.from)!.push(edge);
    adjacency.get(edge.to)!.push({
      from: edge.to,
      to: edge.from,
      weight: edge.weight,
    });
  }

  for (const edges of adjacency.values()) {
    edges.sort(
      (a, b) =>
        a.weight - b.weight ||
        a.to.localeCompare(b.to) ||
        a.from.localeCompare(b.from),
    );
  }

  return adjacency;
}

export function runPrim(graph: GraphRequest): GraphResult {
  const errors = validateGraphInput("prim", graph);
  if (errors.length) throw new Error(errors.join(" "));

  const adjacency = buildAdjacency(graph);
  const visited = new Set<string>([graph.startNode]);
  const visitedNodes: string[] = [graph.startNode];
  const selectedEdges: Edge[] = [];
  const steps: GraphStep[] = [];

  const distances: Record<string, number> = Object.fromEntries(
    graph.nodes.map((node) => [node, Infinity]),
  );
  distances[graph.startNode] = 0;

  let totalWeight = 0;

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
      totalWeight,
      sourceLine: 1,
      ...extra,
    });
  };

  record("start", `Start Prim at ${graph.startNode}.`);

  while (visited.size < graph.nodes.length) {
    let bestEdge: Edge | undefined;

    for (const node of visited) {
      for (const edge of adjacency.get(node) ?? []) {
        if (visited.has(edge.to)) continue;

        if (
          !bestEdge ||
          edge.weight < bestEdge.weight ||
          (edge.weight === bestEdge.weight &&
            edge.to.localeCompare(bestEdge.to) < 0)
        ) {
          bestEdge = edge;
        }
      }
    }

    if (!bestEdge) {
      const message =
        "The graph is disconnected. A spanning tree cannot include every node.";

      record("error", message);

      return {
        algorithm: "prim",
        steps,
        visitedOrder: visitedNodes,
        selectedEdges,
        distances,
        path: [],
        totalWeight,
        error: message,
      };
    }

    visited.add(bestEdge.to);
    visitedNodes.push(bestEdge.to);
    selectedEdges.push(bestEdge);
    totalWeight += bestEdge.weight;
    distances[bestEdge.to] = bestEdge.weight;

    record(
      "select-edge",
      `Select ${bestEdge.from} → ${bestEdge.to}, weight ${bestEdge.weight}.`,
      {
        currentNode: bestEdge.to,
        edgeFrom: bestEdge.from,
        edgeTo: bestEdge.to,
        activeEdge: bestEdge,
        sourceLine: 15,
      },
    );
  }

  record("complete", `Minimum spanning tree weight: ${totalWeight}.`);

  return {
    algorithm: "prim",
    steps,
    visitedOrder: visitedNodes,
    selectedEdges,
    distances,
    path: [],
    totalWeight,
  };
}