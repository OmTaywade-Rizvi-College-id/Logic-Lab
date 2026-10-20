

import { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  Clock3,
  Database,
  BookOpen,
  Network,
  Lightbulb,
  ChevronRight,
  Zap,
} from "lucide-react";
import "./CodeComplexity.css";

const algorithms = {
  dijkstra: {
    title: "Dijkstra's Algorithm",
    category: "Graph",
    difficulty: "Intermediate",
    description:
      "Find the shortest paths from a source node to all other reachable nodes in a weighted graph with non-negative edge weights.",
    time: "O(V²)",
    space: "O(V²)",
    timeNote:
      "The implementation below uses an adjacency matrix and a linear search to find the closest unvisited vertex.",
    spaceNote:
      "The adjacency matrix takes O(V²) space. The distance, visited, and parent arrays use O(V) additional space.",
    c: `#include <stdio.h>

#define V 6
#define INF 999999

int minDistance(int dist[], int visited[]) {
    int min = INF;
    int minIndex = -1;

    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            minIndex = v;
        }
    }

    return minIndex;
}

void dijkstra(int graph[V][V], int source) {
    int dist[V];
    int visited[V] = {0};
    int parent[V];

    for (int i = 0; i < V; i++) {
        dist[i] = INF;
        parent[i] = -1;
    }

    dist[source] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);

        if (u == -1) break;

        visited[u] = 1;

        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] > 0 &&
                dist[u] != INF &&
                dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }

    printf("Vertex  Distance\\n");

    for (int i = 0; i < V; i++) {
        if (dist[i] == INF)
            printf("%d       Unreachable\\n", i);
        else
            printf("%d       %d\\n", i, dist[i]);
    }
}

int main(void) {
    int graph[V][V] = {0};

    graph[0][1] = graph[1][0] = 4;
    graph[0][2] = graph[2][0] = 2;
    graph[1][3] = graph[3][1] = 1;
    graph[2][4] = graph[4][2] = 3;
    graph[3][5] = graph[5][3] = 1;
    graph[3][4] = graph[4][3] = 2;
    graph[4][5] = graph[5][4] = 5;

    dijkstra(graph, 0);
    return 0;
}`,
    pseudocode: `DIJKSTRA(graph, source):
    for each vertex v:
        distance[v] = INFINITY
        visited[v] = false

    distance[source] = 0

    repeat V - 1 times:
        u = unvisited vertex with
            minimum distance

        if no such vertex exists:
            stop

        visited[u] = true

        for each neighbor v of u:
            if v is unvisited and
               distance[u] + weight(u, v)
                   < distance[v]:

                distance[v] =
                    distance[u] + weight(u, v)

    return distance`,
    points: [
      "The source vertex begins with distance zero.",
      "All other vertices begin with infinite distance.",
      "The closest unvisited vertex is selected.",
      "Neighbor distances are updated when a shorter route is found.",
      "The process stops when no reachable unvisited vertex remains.",
    ],
    applications: [
      "GPS navigation and route planning",
      "Network packet routing",
      "Robot path planning",
      "Finding low-cost connections in weighted networks",
    ],
  },
  bfs: {
    title: "Breadth-First Search",
    category: "Graph",
    difficulty: "Beginner",
    description:
      "Explore a graph level by level using a queue. BFS finds shortest paths in unweighted graphs.",
    time: "O(V + E)",
    space: "O(V)",
    timeNote:
      "Each vertex is visited at most once, and each adjacency-list edge is examined at most once.",
    spaceNote:
      "The visited array and queue require O(V) auxiliary space.",
    c: `#include <stdio.h>

#define V 6

void bfs(int graph[V][V], int source) {
    int visited[V] = {0};
    int queue[V];
    int front = 0, rear = 0;

    visited[source] = 1;
    queue[rear++] = source;

    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);

        for (int v = 0; v < V; v++) {
            if (graph[u][v] && !visited[v]) {
                visited[v] = 1;
                queue[rear++] = v;
            }
        }
    }
}

int main(void) {
    int graph[V][V] = {0};
    graph[0][1] = graph[1][0] = 1;
    graph[0][2] = graph[2][0] = 1;
    graph[1][3] = graph[3][1] = 1;
    graph[2][4] = graph[4][2] = 1;

    bfs(graph, 0);
    return 0;
}`,
    pseudocode: `BFS(graph, source):
    create an empty queue
    mark source as visited
    enqueue source

    while queue is not empty:
        u = dequeue()

        for each neighbor v of u:
            if v is not visited:
                mark v as visited
                enqueue v`,
    points: [
      "BFS uses a queue to manage the next vertex.",
      "Vertices are explored in increasing distance from the source.",
      "Mark a vertex visited when it is enqueued.",
      "BFS finds shortest paths when all edges have equal cost.",
    ],
    applications: [
      "Finding minimum-hop routes",
      "Social network connections",
      "Web crawling",
      "Level-order tree traversal",
    ],
  },
  dfs: {
    title: "Depth-First Search",
    category: "Graph",
    difficulty: "Beginner",
    description:
      "Explore as far as possible along a branch before backtracking to explore other branches.",
    time: "O(V + E)",
    space: "O(V)",
    timeNote:
      "With an adjacency list, each vertex and edge is processed at most a constant number of times.",
    spaceNote:
      "The visited array and recursion stack can each use up to O(V) space.",
    c: `#include <stdio.h>

#define V 6

void dfs(int graph[V][V], int u,
         int visited[V]) {
    visited[u] = 1;
    printf("%d ", u);

    for (int v = 0; v < V; v++) {
        if (graph[u][v] && !visited[v]) {
            dfs(graph, v, visited);
        }
    }
}

int main(void) {
    int graph[V][V] = {0};
    int visited[V] = {0};

    graph[0][1] = graph[1][0] = 1;
    graph[0][2] = graph[2][0] = 1;
    graph[1][3] = graph[3][1] = 1;
    graph[2][4] = graph[4][2] = 1;

    dfs(graph, 0, visited);
    return 0;
}`,
    pseudocode: `DFS(graph, u):
    mark u as visited
    process u

    for each neighbor v of u:
        if v is not visited:
            DFS(graph, v)`,
    points: [
      "DFS follows one branch as deeply as possible.",
      "Visited markers prevent repeated exploration.",
      "Backtracking occurs when no unvisited neighbor remains.",
      "DFS traversal does not generally guarantee shortest paths.",
    ],
    applications: [
      "Maze exploration",
      "Cycle detection",
      "Connected component analysis",
      "Dependency and topological analysis",
    ],
  },
};

export default function CodeComplexity() {
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [language, setLanguage] = useState("c");
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  const data = algorithms[algorithm];
  const code = language === "c" ? data.c : data.pseudocode;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.alert("Copy failed. Please select and copy the code manually.");
    }
  }

  return (
    <main className="page cc-page">
      <header className="cc-heading">
        <div>
          <p className="eyebrow">LEARN THE LOGIC BEHIND THE CODE</p>
          <h1>
            Code <span className="gradient-text">& Complexity</span>
          </h1>
          <p>
            Go beyond the output. Understand the implementation,
            analyze efficiency, and learn why an algorithm works.
          </p>
        </div>

        <div className="cc-heading-icon">
          <Code2 size={42} />
        </div>
      </header>

      <section className="cc-selector lab-panel">
        <div>
          <label htmlFor="cc-algorithm">Choose an algorithm</label>
          <select
            id="cc-algorithm"
            value={algorithm}
            onChange={(event) => {
              setAlgorithm(event.target.value);
              setCopied(false);
            }}
          >
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="bfs">Breadth-First Search (BFS)</option>
            <option value="dfs">Depth-First Search (DFS)</option>
          </select>
        </div>

        <div className="cc-algorithm-meta">
          <span><Network size={15} /> {data.category}</span>
          <span><Zap size={15} /> {data.difficulty}</span>
        </div>
      </section>

      <section className="cc-complexity-grid">
        <article className="cc-complexity-card lab-panel">
          <div className="cc-card-icon mint"><Clock3 size={21} /></div>
          <p>Time Complexity</p>
          <h2>{data.time}</h2>
          <span>How runtime grows with input size</span>
        </article>

        <article className="cc-complexity-card lab-panel">
          <div className="cc-card-icon blue"><Database size={21} /></div>
          <p>Space Complexity</p>
          <h2>{data.space}</h2>
          <span>How memory usage grows with input size</span>
        </article>

        <article className="cc-complexity-card lab-panel">
          <div className="cc-card-icon purple"><BookOpen size={21} /></div>
          <p>Algorithm Category</p>
          <h2>{data.category}</h2>
          <span>Explore its approach and use cases</span>
        </article>
      </section>

      <section className="cc-content-grid">
        <div className="cc-main-column">
          <article className="lab-panel cc-overview">
            <div className="cc-section-heading">
              <div>
                <p className="eyebrow">ALGORITHM OVERVIEW</p>
                <h2>{data.title}</h2>
              </div>
              <span className="cc-status">Learning module</span>
            </div>

            <p>{data.description}</p>

            <div className="cc-tabs">
              {[
                ["overview", "Overview"],
                ["how", "How It Works"],
                ["applications", "Applications"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  className={activeTab === id ? "cc-tab active" : "cc-tab"}
                  onClick={() => setActiveTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="cc-tab-content">
                <h3>What should you understand?</h3>
                <p>
                  Focus on how the algorithm changes its state, makes
                  decisions, and reaches its result.
                </p>
                <div className="cc-point-list">
                  {data.points.map((point, index) => (
                    <div className="cc-point" key={point}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "how" && (
              <div className="cc-tab-content">
                <h3>How it works</h3>
                <p>
                  Follow the steps in order, then compare the pseudocode
                  with the implementation to see how each step translates
                  into instructions.
                </p>
                <div className="cc-point-list">
                  {data.points.map((point, index) => (
                    <div className="cc-point" key={point}>
                      <span>{index + 1}</span>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "applications" && (
              <div className="cc-tab-content">
                <h3>Real-world applications</h3>
                <div className="cc-application-grid">
                  {data.applications.map((item) => (
                    <div className="cc-application" key={item}>
                      <Network size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          <article className="lab-panel cc-code-panel">
            <div className="cc-code-header">
              <div>
                <p className="eyebrow">IMPLEMENTATION</p>
                <h2>Explore the Code</h2>
              </div>

              <button className="cc-copy-button" onClick={copyCode}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="cc-language-tabs">
              <button
                className={language === "c" ? "active" : ""}
                onClick={() => {
                  setLanguage("c");
                  setCopied(false);
                }}
              >
                C
              </button>
              <button
                className={language === "pseudocode" ? "active" : ""}
                onClick={() => {
                  setLanguage("pseudocode");
                  setCopied(false);
                }}
              >
                Pseudocode
              </button>
            </div>

            <pre className="cc-code"><code>{code}</code></pre>

            <div className="cc-code-footer">
              <span><Code2 size={15} /> {language === "c" ? "C language" : "Language-independent logic"}</span>
              <span>{code.split("\n").length} lines</span>
            </div>
          </article>
        </div>

        <aside className="cc-side-column">
          <article className="lab-panel cc-explanation">
            <div className="cc-side-title">
              <Lightbulb size={20} />
              <h3>Complexity Explained</h3>
            </div>

            <h4>Time complexity</h4>
            <div className="cc-big-complexity">{data.time}</div>
            <p>{data.timeNote}</p>

            <div className="cc-mini-divider" />

            <h4>Space complexity</h4>
            <div className="cc-big-complexity">{data.space}</div>
            <p>{data.spaceNote}</p>
          </article>

          <article className="lab-panel cc-key-points">
            <h3>Key Takeaways</h3>
            {data.points.slice(0, 4).map((point) => (
              <div className="cc-takeaway" key={point}>
                <Check size={16} />
                <p>{point}</p>
              </div>
            ))}
          </article>

          <button
            className="cc-route-cta"
            onClick={() => {
              window.location.href = "/route-lab";
            }}
          >
            <span>
              <strong>See it in action</strong>
              <small>Explore the interactive workspace</small>
            </span>
            <ChevronRight size={20} />
          </button>
        </aside>
      </section>

      <footer className="cc-footer">
        <span>The Logic Lab</span>
        <span>Understand the code. Analyze the logic. Build your intuition.</span>
      </footer>
    </main>
  );
}
