
import { useState } from "react";
import { Copy, Check } from "lucide-react";


const snippets = {
  C: `#include <stdio.h>
#include <limits.h>
#include <stdbool.h>

#define V 6

int minDistance(int dist[], bool visited[]) {
    int min = INT_MAX;
    int minIndex = -1;

    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] < min) {
            min = dist[v];
            minIndex = v;
        }
    }

    return minIndex;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool visited[V] = {false};

    for (int i = 0; i < V; i++)
        dist[i] = INT_MAX;

    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);

        if (u == -1)
            break;

        visited[u] = true;

        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] > 0 &&
                dist[u] != INT_MAX &&
                dist[u] + graph[u][v] < dist[v]) {

                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    for (int i = 0; i < V; i++) {
        if (dist[i] == INT_MAX)
            printf("%d -> INF\\\\n", i);
        else
            printf("%d -> %d\\\\n", i, dist[i]);
    }
}`,
  Pseudocode: `1. Set source distance to 0.
2. Set all other distances to infinity.
3. Select the unvisited node with
   the smallest distance.
4. Visit its neighboring nodes.
5. Update distances when a shorter
   path is found.
6. Repeat until all reachable nodes
   have been processed.`,
};

export default function CodePanel() {
  const [language, setLanguage] = useState("C");
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(snippets[language]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="lab-panel code-panel">
      <div className="code-tabs">
        {Object.keys(snippets).map((item) => (
          <button
            key={item}
            className={language === item ? "active" : ""}
            onClick={() => setLanguage(item)}
          >
            {item}
          </button>
        ))}

        <button
          className="copy-button"
          onClick={copyCode}
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="code-content">
        <code>{snippets[language]}</code>
      </pre>
    </section>
  );
}
