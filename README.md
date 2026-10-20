# The Logic Lab

**Interactive Algorithm Visualization and Learning Platform**

> See how algorithms really work: run them on your own input, step through every decision, and understand *why* they produce their result.

---

## Academic Details

| | |
|---|---|
| **College** | Rizvi College of Engineering |
| **Year / Division** | S.E. Computer Engineering, Div A |

### Team Members

| No. | Name | UIN |
|---|---|---|
| 1 | Abrarkhan Mokashi | 251P054 |
| 2 | Om Satish Taywade | 251P027 |
| 3 | Shashvat Nilesh Kawali | 251P023 |
| 4 | Ayush Jha | 251P042 |

---

## Overview

The Logic Lab is a web-based platform that helps students understand how algorithms work internally and how they solve real-world problems. Instead of only reading theory or watching a fixed animation, users interact with a working application: they change inputs, observe every execution step, explore alternative decisions, and see why a particular result is produced.

It combines algorithm learning, real-world applications, dynamic visualization, and code analysis in one website.

## Problem Statement

Many students can memorize an algorithm but struggle to understand how it behaves. For example, they may know that Dijkstra's algorithm finds the shortest path, but not:

- Why one route is chosen over another
- How the algorithm explores different nodes
- Why certain paths are rejected
- What happens when the input or edge weights change
- How the code maps to each step of the visualization

The Logic Lab makes algorithms **visible, interactive, and explainable**.

## What Makes It Different

| Pillar | Description |
|---|---|
| **Execution** | The algorithm actually runs on the user's input |
| **Visualization** | Users watch the state change over time |
| **Explanation** | Users learn why each state change happened |
| **Experimentation** | Users modify inputs and investigate new results |

Example: increase the weight of one road, rerun Dijkstra, and inspect why the previous route is no longer the shortest.

---

## Pages

1. **Home**: dark-themed interface with subtle animations, search bar, featured algorithms, and categories.
2. **Algorithm Explorer**: algorithms grouped by category, difficulty, and application, each with a description, purpose, complexity, and a link to its workspace.
3. **Interactive Workspace**: the core feature. Users edit a graph, run an algorithm, pause it, step through it, and inspect the decisions behind the output.

## Modules (Real-World Applications)

| Module | Algorithm | Real-world scenario |
|---|---|---|
| **Smart Route Finder** | Dijkstra's Algorithm | Shortest route on a weighted road network |
| **Network Exploration** | BFS and DFS | Connected computers, rooms in a building, relationships between objects |
| **Resource Optimization** | 0/1 Knapsack (DP) | Choosing items to maximize value within a capacity limit |
| **Network Connection Planning** | Prim's / Kruskal's (MST) | Connecting locations at minimum total cost with no unnecessary cycles |

All modules share the same platform and a consistent visualization interface.

## Flagship Feature: Dijkstra "Route Lab"

The first module to be built, as it best demonstrates the project's idea.

1. **Create or load a graph**: add nodes, connect them with edges, set weights.
2. **Select source and destination** (e.g. A to F).
3. **Run the algorithm**: the Java backend computes real distances, predecessor links, and execution steps.
4. **Animate the execution**: GSAP highlights visited nodes, explored edges, distance updates, and the final path.
5. **Inspect any step**: see a node's or edge's current distance, previous value, predecessor, and the reason for an update or rejection.
6. **Explore alternatives**: compare another route's cost, or change a weight and rerun.

> **Note:** Dijkstra expands from the *source only*, always choosing the unvisited node with the smallest tentative distance. A genuine two-direction search would be implemented separately as *bidirectional Dijkstra*.

## Features

| Feature | Description |
|---|---|
| Algorithm search | Find algorithms by name, category, or application |
| Difficulty levels | Beginner, medium, and advanced topics |
| Interactive editor | Create graphs, enter values, change inputs |
| Play / pause / step controls | Run execution at the user's own pace |
| Execution inspector | Explains decisions and state changes at each step |
| Code panel | Pseudocode or Java implementations |
| Complexity analysis | Time and space complexity explanations |
| Compare algorithms | Compare approaches on the same problem |
| Real-world scenarios | Navigation, networks, and optimization |
| Save and reload | Store custom examples and configurations |
| Practice mode | Problems to solve, with answer verification |

The first release prioritizes the **graph editor, algorithm execution, step-by-step visualization, and explanation panel**.

---

## Tech Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js + React | Pages, workspace, graph editor, forms, code panel, responsive UI |
| Animation | GSAP | Nodes, edges, paths, transitions, counters, execution steps |
| Graph rendering | SVG | Drawing the interactive graph |
| Backend | Java Servlets + Apache Tomcat | Request handling, validation, algorithm execution, REST-style JSON APIs |
| Database | MySQL | Algorithm info, examples, test problems, saved graphs, optional user data |
| Tooling | GitHub, Postman | Collaboration and API testing |

## Architecture

```
Next.js frontend
      |  HTTP requests (JSON)
      v
Java Servlet controllers   -> validate requests, return JSON
      |
      v
Algorithm services         -> Dijkstra / BFS / DFS / Knapsack / MST
      |                       (compute result + execution trace)
      v
MySQL database             -> persistent data when required
```

The backend contains the actual algorithm logic. The frontend uses the returned **execution trace** to synchronize the graph animation, explanation panel, and code display.

> Algorithm calculations happen in **Java**, not in MySQL. The database only stores persistent information.

### Proposed API

| Endpoint | Purpose |
|---|---|
| `POST /api/algorithms/dijkstra/run` | Execute Dijkstra |
| `POST /api/algorithms/bfs/run` | Execute BFS |
| `POST /api/algorithms/dfs/run` | Execute DFS |
| `POST /api/algorithms/knapsack/run` | Solve a 0/1 knapsack problem |
| `GET /api/algorithms` | Retrieve algorithm information |
| `GET /api/algorithms/{id}` | Retrieve an algorithm's details |

The Dijkstra endpoint accepts a graph plus source and destination node IDs, and returns:

- Shortest distance and path
- Sequence of execution steps
- Visited nodes and explored edges
- Distance updates and predecessor changes
- The reason for each decision

### Database Tables

| Table | Purpose |
|---|---|
| `algorithms` | Name, category, description, difficulty, complexity |
| `examples` | Sample inputs, outputs, explanations |
| `applications` | Real-world use cases for algorithms |
| `saved_graphs` | User-created graph configurations |
| `users` *(optional)* | Accounts and preferences |
| `user_progress` *(optional)* | Completed exercises and saved progress |

---

## Team Responsibilities

| Member | Role | Focus |
|---|---|---|
| Abrarkhan Mokashi | UI and Frontend | Homepage, explorer, navigation, responsive design, forms, workspace layout |
| Om Satish Taywade | Java Backend | Servlet APIs, request validation, JSON responses, service integration, error handling |
| Shashvat Nilesh Kawali | Algorithms and GSAP | Execution traces, graph interactions, animations, highlighting, step explanations |
| Ayush Jha | Database, Testing, Integration | MySQL schema, output and API testing, module integration, sample problems, documentation |

*Roles follow the project plan's four-way split; adjust the names if your team assigns them differently.*

All members collaborate through GitHub and integrate regularly. Testing starts from the beginning, not in the final week.

## Development Roadmap

| Phase | Goal |
|---|---|
| **1. Foundation** | Finalize interface, project structure, API format, and database schema |
| **2. First working algorithm** | Dijkstra end to end: graph input, Java execution, animated output |
| **3. Expand algorithms** | Add BFS, DFS, 0/1 Knapsack, and an MST algorithm |
| **4. Learning tools** | Code explanations, complexity analysis, alternate-path inspection, practice questions |
| **5. Testing and deployment** | Edge cases, visualization validation, module integration, demo preparation |

## Initial Deliverable

A fully functional shortest-path visualization with:

- Editable graphs
- Correct backend calculations
- Animated execution
- Code and complexity panels
- Alternative-route analysis

---

## Getting Started

> Setup steps will be finalized as the project structure is created. Placeholder outline:

```bash
# Clone the repository
git clone <repository-url>
cd the-logic-lab

# Frontend
cd frontend
npm install
npm run dev

# Backend
# Build the Java Servlet project and deploy the WAR to Apache Tomcat

# Database
# Create the MySQL schema and load sample data
```

## Project Structure *(planned)*

```
the-logic-lab/
├── frontend/     # Next.js + React + GSAP
├── backend/      # Java Servlets, algorithm services
├── database/     # MySQL schema and seed data
└── docs/         # Project documentation
```

---

## Acknowledgements

Developed as a college project at **Rizvi College of Engineering**, S.E. Computer Engineering, Div A.
