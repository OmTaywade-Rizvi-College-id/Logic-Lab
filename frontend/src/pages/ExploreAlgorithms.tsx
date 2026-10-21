import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Network,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import AlgorithmSelector from "../components/AlgorithmSelector";
import GraphInputs from "../components/GraphInputs";
import GraphEditor from "../components/GraphEditor";
import PlaybackControls from "../components/PlaybackControls";
import ExecutionTrace from "../components/ExecutionTrace";
import SectionCard from "../components/SectionCard";
import SortingWorkspace from "../components/SortingWorkspace";
import AlgorithmGraphCanvas from "../components/AlgorithmGraphCanvas";

import { getAlgorithm, listAlgorithms } from "../algorithms/algorithmRegistry";
import { runAlgorithm, isGraphAlgorithm } from "../api";
import { usePlayback } from "../hooks/usePlayback";

import type {
  AlgorithmId,
  Edge,
  GraphRequest,
  GraphResult,
  GraphStep,
} from "../types";

const INITIAL_NODES = ["A", "B", "C", "D", "E", "F"];

const INITIAL_EDGES: Edge[] = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "B", to: "C", weight: 1 },
  { from: "B", to: "D", weight: 5 },
  { from: "C", to: "D", weight: 8 },
  { from: "C", to: "E", weight: 10 },
  { from: "D", to: "E", weight: 2 },
  { from: "D", to: "F", weight: 6 },
  { from: "E", to: "F", weight: 3 },
];

function isAlgorithmId(value: string | null): value is AlgorithmId {
  return listAlgorithms().some((algorithm) => algorithm.id === value);
}

export default function ExploreAlgorithms() {
  const graphSectionRef = useRef<HTMLElement>(null);

  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>(() => {
    const query = new URLSearchParams(window.location.search).get("algorithm");
    return isAlgorithmId(query) ? query : "dijkstra";
  });

  const [edges, setEdges] = useState<Edge[]>(() =>
    INITIAL_EDGES.map((edge) => ({ ...edge })),
  );
  const [source, setSource] = useState("A");
  const [destination, setDestination] = useState("F");
  const [search, setSearch] = useState("");
  const [directed, setDirected] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const [result, setResult] = useState<GraphResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const algorithm = getAlgorithm(algorithmId);
  const isSorting = algorithm.kind === "sorting";
  const isGraph = isGraphAlgorithm(algorithmId);

  const graphSteps = useMemo<GraphStep[]>(
    () => result?.steps ?? [],
    [result],
  );

  const playback = usePlayback<GraphStep>(graphSteps);
  const activeStep = playback.currentStep;
  const stepIndex = playback.stepIndex;

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("algorithm", algorithmId);
    window.history.replaceState({}, "", url);
  }, [algorithmId]);

  const scrollToGraph = useCallback(() => {
    graphSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const clearExecution = useCallback(() => {
    playback.reset();
    setResult(null);
    setError(null);
  }, [playback.reset]);

  const selectAlgorithm = useCallback(
    (id: AlgorithmId) => {
      setAlgorithmId(id);
      playback.reset();
      setResult(null);
      setError(null);
      setBusy(false);

      if (id === "prim") {
        setDirected(false);
      }

    },
    [playback.reset],
  );

  const executeAlgorithm = useCallback(() => {
    if (!isGraph || !isGraphAlgorithm(algorithmId)) {
      return;
    }

    setBusy(true);
    setError(null);
    playback.reset();

    try {
      const request: Omit<GraphRequest, "algorithm"> = {
        nodes: [...INITIAL_NODES],
        edges: edges.map((edge) => ({ ...edge })),
        startNode: source,
        endNode: algorithm.requiresDestination ? destination : undefined,
        directed: algorithmId === "prim" ? false : directed,
      };

      const graphResult = runAlgorithm(algorithmId, request);

      setResult(graphResult);

    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Algorithm execution failed.";

      setResult(null);
      setError(message);
    } finally {
      setBusy(false);
    }
  }, [
    algorithmId,
    algorithm,
    directed,
    destination,
    edges,
    isGraph,
    playback.reset,
    source,
  ]);

  const updateEdge = (
    index: number,
    field: keyof Edge,
    value: string,
  ) => {
    setEdges((current) =>
      current.map((edge, i) => {
        if (i !== index) return edge;

        if (field === "weight") {
          if (value.trim() === "") return edge;

          const weight = Number(value);
          if (!Number.isFinite(weight)) return edge;

          return { ...edge, weight };
        }

        return { ...edge, [field]: value };
      }),
    );

    clearExecution();
  };

  const addEdge = () => {
    if (INITIAL_NODES.length < 2) return;

    setEdges((current) => [
      ...current,
      {
        from: INITIAL_NODES[0],
        to: INITIAL_NODES[1],
        weight: 1,
      },
    ]);

    clearExecution();
  };

  const deleteEdge = useCallback(
    (index: number) => {
      setEdges((current) => current.filter((_, i) => i !== index));
      clearExecution();
    },
    [clearExecution],
  );

  const resetGraph = useCallback(() => {
    setEdges(INITIAL_EDGES.map((edge) => ({ ...edge })));
    setDirected(false);
    setSource("A");
    setDestination("F");
    setSearch("");
    clearExecution();
  }, [clearExecution]);

  const path = result?.path ?? [];

  const totalWeight = useMemo(() => {
    if (!result || path.length < 2) return 0;

    return path.slice(1).reduce((sum, node, index) => {
      const previous = path[index];

      const edge = edges.find(
        (item) =>
          (item.from === previous && item.to === node) ||
          (!directed && item.from === node && item.to === previous),
      );

      return sum + (edge?.weight ?? 0);
    }, 0);
  }, [result, path, edges, directed]);

  return (
    <div className="min-h-screen bg-[#f5f7f1] text-[#1d2d21]">
      <div className="mx-auto max-w-[1500px] px-3 py-2 sm:px-4">
        <header className="mb-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#203626] text-lg font-black text-lime-200">
              L
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[#1d2d21] sm:text-2xl">
                Algorithm Visualizer
              </h1>
            </div>
          </div>

        </header>

        <section className="relative mb-3 flex flex-col gap-2 rounded-lg border border-[#dce4d6] bg-white p-2 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <AlgorithmSelector
              value={algorithmId}
              onChange={selectAlgorithm}
              disabled={busy}
            />

            {!isSorting && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    scrollToGraph();
                    executeAlgorithm();
                  }}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#203626] px-3.5 py-2.5 text-sm font-semibold text-lime-200 hover:bg-[#2e4933] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play size={14} fill="currentColor" />
                  {busy ? "Running…" : "Run"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    scrollToGraph();
                    if (playback.playing) playback.pause();
                    else playback.play();
                  }}
                  disabled={!graphSteps.length}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#dce4d6] px-3.5 py-2.5 text-sm font-medium text-[#203626] hover:bg-[#f2f5ed] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {playback.playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                  {playback.playing ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={scrollToGraph}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#dce4d6] px-3 py-2.5 text-sm text-[#687768] hover:bg-[#f2f5ed]"
                >
                  <ArrowUpRight size={14} />
                  Graph
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end sm:border-l sm:border-[#e8ece3] sm:pl-2">
            <button
              type="button"
              onClick={() => {
                clearExecution();
                scrollToGraph();
              }}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-[#687768] transition-colors hover:bg-[#f2f5ed] hover:text-[#203626] sm:self-center"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </section>

        <main>
          {isSorting ? (
            <SortingWorkspace
              key={algorithmId}
              algorithm={algorithmId as "selectionSort" | "insertionSort" | "quickSort"}
            />
          ) : (
            <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,.8fr)]">
              <div className="space-y-2">
                <section
                  ref={graphSectionRef}
                  id="graph-visualization"
                  className="scroll-mt-6 rounded-2xl"
                >
                  <SectionCard
                    number="01"
                    eyebrow="GRAPH"
                    title="Graph"
                    icon={<Network size={17} className="text-[#789247]" />}
                    
                    action={
                      <span className="rounded-lg border border-[#dfe5d8] bg-white/80 px-3 py-1.5 text-xs text-[#718070]">
                        {algorithmId === "prim"
                          ? "Undirected"
                          : directed
                            ? "Directed"
                            : "Undirected"}
                      </span>
                    }
                  >
                    <AlgorithmGraphCanvas
                      nodes={INITIAL_NODES.map((id, index) => ({
                        id,
                        x: [70, 220, 220, 385, 385, 535][index],
                        y: [180, 65, 290, 180, 290, 180][index],
                      }))}
                      edges={edges.map((edge) => ({
                        from: edge.from,
                        to: edge.to,
                        weight: edge.weight,
                      }))}
                      directed={algorithmId === "prim" ? false : directed}
                      source={source}
                      destination={destination}
                      search={search}
                      resultPath={path}
                      step={activeStep ?? null}
                      revealedPathEdges={path.length}
                      algorithmLabel={algorithm.label}
                    />
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      <Metric label="Nodes" value={INITIAL_NODES.length} />
                      <Metric label="Edges" value={edges.length} />
                      <Metric
                        label="Current step"
                        value={
                          graphSteps.length
                            ? `${stepIndex + 1}/${graphSteps.length}`
                            : "—"
                        }
                      />
                    </div>
                  </SectionCard>
                </section>

                {error && (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
                    {error}
                  </p>
                )}

                <GraphInputs
                  nodes={INITIAL_NODES}
                  source={source}
                  destination={destination}
                  search={search}
                  directed={algorithmId === "prim" ? false : directed}
                  algorithm={algorithm}
                  onSource={(value) => {
                    setSource(value);
                    clearExecution();
                  }}
                  onDestination={(value) => {
                    setDestination(value);
                    clearExecution();
                  }}
                  onSearch={setSearch}
                  onDirected={(value) => {
                    if (algorithmId === "prim" && value) {
                      return;
                    }
                    setDirected(value);
                    clearExecution();
                  }}
                  onRun={executeAlgorithm}
                  busy={busy}
                />

                <PlaybackControls
                  stepIndex={stepIndex}
                  totalSteps={graphSteps.length}
                  speed={playback.speed}
                  repeats={1}
                  playing={playback.playing}
                  onPrevious={playback.previous}
                  onNext={playback.next}
                  onTogglePlay={() => {
                    if (playback.playing) playback.pause();
                    else playback.play();
                  }}
                  onSpeed={playback.setSpeed}
                  onRepeats={() => undefined}
                  onToggleEditor={() => setEditorOpen((open) => !open)}
                  editorOpen={editorOpen}
                />

                {editorOpen && (
                  <GraphEditor
                    edges={edges}
                    onChange={updateEdge}
                    onAdd={addEdge}
                    onDelete={deleteEdge}
                    onReset={resetGraph}
                    onApply={executeAlgorithm}
                  />
                )}

                {result && (
                  <SectionCard
                    number="02"
                    eyebrow="RESULT"
                    title="Execution summary"
                    icon={<Sparkles size={17} className="text-[#789247]" />}
                    
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Metric
                        label="Visited nodes"
                        value={result.visitedOrder.length}
                      />
                      <Metric
                        label="Selected edges"
                        value={result.selectedEdges.length}
                      />
                      <Metric
                        label={algorithmId === "prim" ? "Tree weight" : "Path cost"}
                        value={
                          algorithmId === "prim"
                            ? result.totalWeight
                            : result.path.length
                              ? totalWeight
                              : "No path"
                        }
                      />
                      <Metric
                        label="Execution steps"
                        value={result.steps.length}
                      />
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#e0e6d9] bg-[#f7f9f3] p-4">
                      <p className="text-xs text-[#778474]">
                        {algorithmId === "prim" ? "Selected tree edges" : "Result path"}
                      </p>
                      <p className="mt-2 break-words font-mono text-sm text-[#587a35]">
                        {algorithmId === "prim"
                          ? result.selectedEdges.length
                            ? result.selectedEdges
                              .map((edge) => `${edge.from}–${edge.to} (${edge.weight})`)
                              .join(", ")
                            : "No edges selected"
                          : result.path.length
                            ? result.path.join(" → ")
                            : "No path found"}
                      </p>
                    </div>
                  </SectionCard>
                )}
              </div>

              <div>
                <ExecutionTrace
                  result={result}
                  stepIndex={stepIndex}
                  nodes={INITIAL_NODES}
                  onSelectStep={(index) => {
                    playback.pause();
                    playback.seek(index);
                    scrollToGraph();
                  }}
                />
              </div>
            </div>
          )}
        </main>

        
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-[#e0e6d9] bg-white p-2.5">
      <p className="text-xs text-[#778474]">{label}</p>
      <p className="mt-0.5 truncate text-lg font-bold text-[#223728]">{value}</p>
    </div>
  );
}