import type {
  AlgorithmConfig,
  AlgorithmId,
} from "../types";

export type { AlgorithmConfig };

const algorithms: AlgorithmConfig[] = [
  {
    id: "dijkstra",
    label: "Dijkstra",
    description: "Find the shortest path using non-negative edge weights.",
    kind: "graph",
    requiresWeights: true,
    requiresDestination: true,
    timeComplexity: {
      best: "O(V²)",
      average: "O(V²)",
      worst: "O(V²)",
    },
    spaceComplexity: "O(V + E)",
    sourceCode: {
      typescript: `function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  for (const node of graph.nodes) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  while (visited.size < graph.nodes.length) {
    let current = null;

    for (const node of graph.nodes) {
      if (
        !visited.has(node) &&
        (current === null ||
          distances[node] < distances[current])
      ) {
        current = node;
      }
    }

    if (current === null || distances[current] === Infinity) {
      break;
    }

    visited.add(current);
    if (current === endNode) break;

    for (const edge of graph.adjacency[current]) {
      const candidate = distances[current] + edge.weight;

      if (candidate < distances[edge.to]) {
        distances[edge.to] = candidate;
        previous[edge.to] = current;
      }
    }
  }

  return { distances, previous };
}`,
      cpp: `// Dijkstra's algorithm
// Select the unvisited node with the smallest distance.
// Relax its outgoing edges and update predecessor information.`,
      python: `# Dijkstra's algorithm
# Select the unvisited node with the smallest distance.
# Relax its outgoing edges and update predecessor information.`,
    },
  },
  {
    id: "bfs",
    label: "Breadth-first search (BFS)",
    description: "Explore nodes level by level using a queue.",
    kind: "graph",
    requiresWeights: false,
    requiresDestination: false,
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    spaceComplexity: "O(V)",
    sourceCode: {
      typescript: `function bfs(graph, startNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);

  while (queue.length > 0) {
    const current = queue.shift();

    for (const edge of graph.adjacency[current]) {
      const neighbor = edge.to;

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return visited;
}`,
      cpp: `// BFS uses a FIFO queue.
// Visit each node and enqueue its unvisited neighbors.`,
      python: `# BFS uses a FIFO queue.
# Visit each node and enqueue its unvisited neighbors.`,
    },
  },
  {
    id: "dfs",
    label: "Depth-first search (DFS)",
    description: "Explore branches using depth-first traversal.",
    kind: "graph",
    requiresWeights: false,
    requiresDestination: false,
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
    },
    spaceComplexity: "O(V)",
    sourceCode: {
      typescript: `function dfs(graph, startNode) {
  const stack = [startNode];
  const visited = new Set();

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    for (const edge of graph.adjacency[current]) {
      if (!visited.has(edge.to)) {
        stack.push(edge.to);
      }
    }
  }

  return visited;
}`,
      cpp: `// DFS uses a LIFO stack.
// Visit a node and push its unvisited neighbors.`,
      python: `# DFS uses a LIFO stack.
# Visit a node and push its unvisited neighbors.`,
    },
  },
  {
    id: "prim",
    label: "Prim's algorithm",
    description: "Build a minimum spanning tree.",
    kind: "graph",
    requiresWeights: true,
    requiresDestination: false,
    timeComplexity: {
      best: "O(V²)",
      average: "O(V²)",
      worst: "O(V²)",
    },
    spaceComplexity: "O(V + E)",
    sourceCode: {
      typescript: `function prim(graph, startNode) {
  const visited = new Set([startNode]);
  const selectedEdges = [];

  while (visited.size < graph.nodes.length) {
    let bestEdge = null;

    for (const edge of graph.edges) {
      const crossesTree =
        visited.has(edge.from) !== visited.has(edge.to);

      if (
        crossesTree &&
        (!bestEdge || edge.weight < bestEdge.weight)
      ) {
        bestEdge = edge;
      }
    }

    if (!bestEdge) break;

    selectedEdges.push(bestEdge);
    visited.add(
      visited.has(bestEdge.from)
        ? bestEdge.to
        : bestEdge.from
    );
  }

  return selectedEdges;
}`,
      cpp: `// Prim's algorithm
// Repeatedly select the minimum-weight edge connecting
// the current tree to an unvisited vertex.`,
      python: `# Prim's algorithm
# Repeatedly select the minimum-weight edge connecting
# the current tree to an unvisited vertex.`,
    },
  },
  {
    id: "insertionSort",
    label: "Insertion sort",
    description: "Sort values by inserting each into its correct position.",
    kind: "sorting",
    requiresWeights: false,
    requiresDestination: false,
    timeComplexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    sourceCode: {
      typescript: `function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = key;
  }

  return array;
}`,
      cpp: `// Insertion sort
// Shift larger elements right and insert the current key.`,
      python: `# Insertion sort
# Shift larger elements right and insert the current key.`,
    },
  },
  {
    id: "quickSort",
    label: "Quick sort",
    description: "Sort values by partitioning around a pivot.",
    kind: "sorting",
    requiresWeights: false,
    requiresDestination: false,
    timeComplexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(log n) average",
    sourceCode: {
      typescript: `function quickSort(array, low = 0, high = array.length - 1) {
  if (low >= high) return array;

  const pivot = array[high];
  let boundary = low;

  for (let j = low; j < high; j++) {
    if (array[j] <= pivot) {
      [array[boundary], array[j]] =
        [array[j], array[boundary]];
      boundary++;
    }
  }

  [array[boundary], array[high]] =
    [array[high], array[boundary]];

  quickSort(array, low, boundary - 1);
  quickSort(array, boundary + 1, high);

  return array;
}`,
      cpp: `// Quick sort
// Partition the array around a pivot and recursively
// sort the left and right partitions.`,
      python: `# Quick sort
# Partition the array around a pivot and recursively
# sort the left and right partitions.`,
    },
  },
  {
    id: "selectionSort",
    label: "Selection sort",
    description: "Repeatedly select the smallest remaining value.",
    kind: "sorting",
    requiresWeights: false,
    requiresDestination: false,
    timeComplexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
    },
    spaceComplexity: "O(1)",
    sourceCode: {
      typescript: `function selectionSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    [array[i], array[minIndex]] =
      [array[minIndex], array[i]];
  }

  return array;
}`,
      cpp: `// Selection sort
// Find the minimum value in the unsorted section
// and swap it into the next position.`,
      python: `# Selection sort
# Find the minimum value in the unsorted section
# and swap it into the next position.`,
    },
  },
];
export function listAlgorithms(): AlgorithmConfig[] {
  return algorithms;
}

export function getAlgorithm(id: AlgorithmId): AlgorithmConfig {
  const algorithm = algorithms.find((item) => item.id === id);

  if (algorithm === undefined) {
    throw new Error(`Unknown algorithm: ${id}`);
  }

  return algorithm;
}

export function isGraphAlgorithm(id: AlgorithmId): boolean {
  return getAlgorithm(id).kind === "graph";
}