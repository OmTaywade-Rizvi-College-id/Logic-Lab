import { useEffect, useRef, useState } from "react";
import { Check, Code2, Copy, FileCode2, Terminal } from "lucide-react";
import gsap from "gsap";

type CodeLanguage = "C" | "Pseudocode";

const snippets: Record<CodeLanguage, string> = {
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

    for (int i = 0; i < V; i++) dist[i] = INT_MAX;
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        if (u == -1) break;
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
        if (dist[i] == INT_MAX) printf("%d -> INF\\n", i);
        else printf("%d -> %d\\n", i, dist[i]);
    }
}`,
  Pseudocode: `1. Set source distance to 0.
2. Set all other distances to infinity.
3. Select the unvisited node with the smallest distance.
4. Mark the selected node as visited.
5. Examine its neighboring nodes.
6. Update distances when a shorter path is found.
7. Repeat until reachable nodes have been processed.`,
};

export default function CodePanel() {
  const [language, setLanguage] = useState<CodeLanguage>("C");
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    }, panel);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const code = codeRef.current;
    if (!code) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(code, { opacity: 0.5, y: 5 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
    }, code);
    return () => ctx.revert();
  }, [language]);

  useEffect(() => () => {
    if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);
  }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(snippets[language]);
      setCopied(true);
      if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  const lines = snippets[language].split("\n");

  return (
    <section ref={panelRef} className="overflow-hidden rounded-[24px] border border-[#e2e7dc] bg-white text-[#203725] shadow-[0_14px_40px_rgba(33,55,33,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ece4] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9e6ca] bg-[#eff5e6] text-[#5d813c]"><Code2 size={20} /></div><div><p className="text-sm font-semibold text-[#203725]">Code Explorer</p><p className="mt-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#8a9585]">Algorithm reference</p></div></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e7dc] bg-[#f8faf5] px-3 py-1.5 text-xs text-[#718070]"><span className="h-1.5 w-1.5 rounded-full bg-[#82b34b]" />Read-only preview</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#203626] px-3 text-white sm:px-4">
        <div className="flex items-center gap-1" role="tablist" aria-label="Code language">
          {(Object.keys(snippets) as CodeLanguage[]).map((item) => {
            const active = language === item;
            return <button type="button" role="tab" aria-selected={active} key={item} onClick={() => { setLanguage(item); setCopied(false); }} className={`relative inline-flex items-center gap-2 px-3 py-4 text-xs font-medium transition-colors sm:px-4 ${active ? "text-lime-200" : "text-white/60 hover:text-white"}`}>
              <FileCode2 size={15} />{item}{active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-lime-300" />}
            </button>;
          })}
        </div>
        <button type="button" onClick={copyCode} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${copied ? "border-lime-300/30 bg-lime-300/10 text-lime-200" : "border-white/15 bg-white/5 text-white/80 hover:border-lime-300/30 hover:text-lime-200"}`}>
          {copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy code"}
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-white/10 bg-[#15251b] px-4 py-2.5 text-white/65"><div className="flex items-center gap-2 text-xs"><Terminal size={14} className="text-lime-300" /><span>{language === "C" ? "dijkstra.c" : "dijkstra.pseudo"}</span></div><span className="font-mono text-[10px] text-white/40">{lines.length} lines</span></div>

      <div className="overflow-x-auto bg-[#101b14]">
        <pre ref={codeRef} className="min-w-max py-4 font-mono text-[12px] leading-[1.85] text-[#dfe9d7] sm:text-[13px]" role="tabpanel"><code>{lines.map((line, index) => <span key={`${language}-${index}`} className="group flex min-h-[24px] pr-6 transition-colors hover:bg-white/[0.035]"><span aria-hidden="true" className="sticky left-0 inline-block w-12 shrink-0 select-none border-r border-white/[0.07] bg-[#101b14] pr-3 text-right text-white/30 group-hover:text-white/55">{index + 1}</span><span className="whitespace-pre pl-4">{line || " "}</span></span>)}</code></pre>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8ece4] bg-[#f8faf5] px-4 py-3 text-[10px] text-[#899386] sm:px-5"><span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#82b34b]" />The Logic Lab</span><span>Language: {language}</span></div>
    </section>
  );
}
