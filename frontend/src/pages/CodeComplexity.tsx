 
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2, Copy, Check, Clock3, Database, BookOpen, Network,
  Lightbulb, ChevronRight, Zap,
} from "lucide-react";

type AlgorithmKey = "dijkstra" | "bfs" | "dfs";
type CodeLanguage = "c" | "pseudocode";
type ContentTab = "overview" | "how" | "applications";

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
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("dijkstra");
  const [language, setLanguage] = useState<CodeLanguage>("c");
  const [activeTab, setActiveTab] = useState<ContentTab>("overview");
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

  const tabs: { id: ContentTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "how", label: "How it works" },
    { id: "applications", label: "Applications" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f0] px-5 py-10 text-[#1d2d21] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <header className="relative overflow-hidden rounded-[30px] bg-[#203626] px-6 py-9 text-white shadow-xl shadow-[#203626]/10 sm:px-10 sm:py-12 lg:px-12">
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-lime-300/10 blur-[80px]" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-[10px] font-bold tracking-[.22em] text-lime-300 sm:text-xs">
                <Code2 size={15} /> UNDERSTAND THE LOGIC BEHIND THE CODE
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-.06em] sm:text-6xl">
                Code & <span className="font-serif font-normal italic text-lime-200">complexity.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Go beyond the output. Understand the implementation, analyze efficiency, and learn why an algorithm works.
              </p>
            </div>
            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.06] text-lime-200 md:flex">
              <Code2 size={38} strokeWidth={1.5} />
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 rounded-[24px] border border-[#e0e5d9] bg-white p-5 shadow-sm sm:grid-cols-[minmax(240px,1fr)_auto] sm:items-end sm:p-6">
          <div>
            <label htmlFor="cc-algorithm" className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-[#6d7b69]">
              Choose an algorithm
            </label>
            <select
              id="cc-algorithm"
              value={algorithm}
              onChange={(event) => {
                setAlgorithm(event.target.value as AlgorithmKey);
                setCopied(false);
              }}
              className="w-full rounded-xl border border-[#dce4d6] bg-[#fafbf7] px-4 py-3.5 text-sm font-semibold text-[#263a29] outline-none transition focus:border-[#91aa72] focus:ring-4 focus:ring-lime-100 sm:max-w-xl"
            >
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="bfs">Breadth-First Search (BFS)</option>
              <option value="dfs">Depth-First Search (DFS)</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eef3e7] px-3.5 py-2 text-xs font-semibold text-[#54733c]"><Network size={14} /> {data.category}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fbf1dc] px-3.5 py-2 text-xs font-semibold text-[#8c6a2a]"><Zap size={14} /> {data.difficulty}</span>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Time complexity", value: data.time, note: "Runtime growth", icon: Clock3, tone: "bg-[#eaf2dc] text-[#668541]" },
            { label: "Space complexity", value: data.space, note: "Memory growth", icon: Database, tone: "bg-[#dff1e8] text-[#34765e]" },
            { label: "Algorithm category", value: data.category, note: "Learning domain", icon: BookOpen, tone: "bg-[#f8ebce] text-[#94702b]" },
          ].map(({ label, value, note, icon: Icon, tone }) => (
            <article key={label} className="rounded-[24px] border border-[#e1e6dc] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}><Icon size={21} /></div>
                <span className="rounded-full bg-[#f5f7f1] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8a9584]">Analysis</span>
              </div>
              <p className="mt-5 text-sm font-medium text-[#728070]">{label}</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-[-.05em] text-[#213629]">{value}</h2>
              <p className="mt-2 text-xs text-[#90998b]">{note}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.75fr)]">
          <div className="space-y-5">
            <article className="overflow-hidden rounded-[26px] border border-[#e0e5d9] bg-white shadow-sm">
              <div className="border-b border-[#e8ece3] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-[.2em] text-[#789247]">ALGORITHM OVERVIEW</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">{data.title}</h2>
                  </div>
                  <span className="rounded-full border border-[#dfe8d5] bg-[#f5f8ef] px-3 py-1.5 text-xs font-semibold text-[#638344]">Learning module</span>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[#778176]">{data.description}</p>
                <div className="mt-6 flex flex-wrap gap-2 border-b border-[#e8ece3] pb-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`-mb-px border-b-2 px-3 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "border-[#6f8f43] text-[#3c5c32]" : "border-transparent text-[#899387] hover:text-[#3c5c32]"}`}
                    >{tab.label}</button>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-lg font-semibold">What should you understand?</h3>
                    <p className="mt-2 text-sm leading-6 text-[#7b8578]">Focus on how the algorithm changes its state, makes decisions, and reaches its result.</p>
                    <div className="mt-5 space-y-3">
                      {data.points.map((point, index) => (
                        <div key={point} className="flex gap-4 rounded-2xl bg-[#f7f9f3] p-4">
                          <span className="font-mono text-xs font-bold text-[#829765]">{String(index + 1).padStart(2, "0")}</span>
                          <p className="text-sm leading-6 text-[#526251]">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "how" && (
                  <div>
                    <h3 className="text-lg font-semibold">How it works</h3>
                    <p className="mt-2 text-sm leading-6 text-[#7b8578]">Follow the steps in order, then compare the pseudocode with the implementation to see how each step translates into instructions.</p>
                    <ol className="mt-5 space-y-3">
                      {data.points.map((point, index) => (
                        <li key={point} className="flex gap-4 rounded-2xl border border-[#e7ebe1] p-4">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eaf1df] text-xs font-bold text-[#58783a]">{index + 1}</span>
                          <p className="text-sm leading-6 text-[#526251]">{point}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {activeTab === "applications" && (
                  <div>
                    <h3 className="text-lg font-semibold">Real-world applications</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {data.applications.map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#e3e8de] bg-[#fbfcf8] p-4 text-sm font-medium text-[#546452]">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eaf1df] text-[#648342]"><Network size={17} /></span>{item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="overflow-hidden rounded-[26px] border border-[#263d2d] bg-[#17271c] text-white shadow-lg shadow-[#203626]/10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
                <div>
                  <p className="text-[10px] font-bold tracking-[.2em] text-lime-300">IMPLEMENTATION</p>
                  <h2 className="mt-2 text-xl font-semibold">Explore the code</h2>
                </div>
                <button type="button" onClick={copyCode} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied!" : "Copy code"}
                </button>
              </div>
              <div className="flex gap-1 px-5 pt-4 sm:px-7">
                {(["c", "pseudocode"] as CodeLanguage[]).map((item) => (
                  <button key={item} type="button" onClick={() => { setLanguage(item); setCopied(false); }} className={`rounded-t-xl px-4 py-2.5 text-xs font-bold transition ${language === item ? "bg-lime-300 text-[#243627]" : "bg-white/[.05] text-white/55 hover:text-white"}`}>
                    {item === "c" ? "C language" : "Pseudocode"}
                  </button>
                ))}
              </div>
              <pre className="max-h-[620px] overflow-auto border-t border-white/5 bg-[#0e1912] p-5 text-xs leading-6 text-[#dbe9d6] sm:p-7 sm:text-sm"><code>{code}</code></pre>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-xs text-white/45 sm:px-7">
                <span className="inline-flex items-center gap-2"><Code2 size={14} />{language === "c" ? "C language" : "Language-independent logic"}</span>
                <span>{code.split("\n").length} lines</span>
              </div>
            </article>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-24">
            <article className="rounded-[26px] border border-[#e0e5d9] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eaf1df] text-[#658443]"><Lightbulb size={20} /></span>
                <h3 className="text-lg font-semibold">Complexity explained</h3>
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7d8a79]">Time complexity</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-.05em] text-[#5d7e3c]">{data.time}</p>
                <p className="mt-2 text-sm leading-6 text-[#7a8578]">{data.timeNote}</p>
              </div>
              <div className="my-6 h-px bg-[#e8ece3]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#7d8a79]">Space complexity</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-.05em] text-[#347a62]">{data.space}</p>
                <p className="mt-2 text-sm leading-6 text-[#7a8578]">{data.spaceNote}</p>
              </div>
            </article>

            <article className="rounded-[26px] border border-[#e0e5d9] bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold">Key takeaways</h3>
              <div className="mt-4 space-y-4">
                {data.points.slice(0, 4).map((point) => (
                  <div key={point} className="flex gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e8f1dd] text-[#5e803b]"><Check size={12} /></span>
                    <p className="text-sm leading-6 text-[#697666]">{point}</p>
                  </div>
                ))}
              </div>
            </article>

            <Link to="/route-lab" className="group flex items-center justify-between gap-4 rounded-[26px] bg-[#203626] p-5 text-white shadow-lg shadow-[#203626]/10 transition hover:bg-[#2d4933] sm:p-6">
              <span><strong className="block text-base">See it in action</strong><small className="mt-1 block text-xs text-white/60">Explore the interactive workspace</small></span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime-300 text-[#203626] transition group-hover:translate-x-1"><ChevronRight size={20} /></span>
            </Link>
          </aside>
        </section>

        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-[#dfe5d8] py-6 text-xs text-[#859080] sm:flex-row">
          <span className="font-semibold tracking-wide text-[#485b47]">THE LOGIC LAB.</span>
          <span>Understand the code. Analyze the logic. Build your intuition.</span>
        </footer>
      </div>
    </main>
  );
}