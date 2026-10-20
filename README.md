# Logic Lab

Logic Lab is an interactive algorithm learning and visualization application.

## Features

- Graph algorithms: BFS, DFS, Dijkstra, and Prim
- Sorting algorithms: Selection Sort, Insertion Sort, and Quick Sort
- Step-by-step algorithm execution
- Graph traversal and shortest-path visualization
- Complexity information and source-code panels

## Requirements

- Node.js
- npm

## Installation

Install project dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

## Type checking

```bash
npx tsc --noEmit
```

## Production build

```bash
npm run build
```

## Algorithms

Graph algorithms use the graph request and result interfaces in `src/types.ts`.

Sorting algorithms use `SortingRequest` and `SortingResult`.

Each execution step contains state and explanation data for the visualizer.