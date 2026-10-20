

import { useEffect, useState } from "react";
import {
  Network,
  Plus,
  Link2,
  Trash2,
  X,
  Lightbulb,
} from "lucide-react";

import AlgorithmInsights from "../components/AlgorithmInsights";
import GraphCanvas from "../components/GraphCanvas";
import ExecutionControls from "../components/ExecutionControls";
import ExecutionSteps from "../components/ExecutionSteps";
import CodePanel from "../components/CodePanel";
import ComplexityPanel from "../components/ComplexityPanel";

const sampleNodes = [
  { id: "A", x: 70, y: 180 },
  { id: "B", x: 220, y: 65 },
  { id: "C", x: 220, y: 290 },
  { id: "D", x: 385, y: 180 },
  { id: "E", x: 385, y: 290 },
  { id: "F", x: 535, y: 180 },
];

const sampleEdges = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "A", to: "D", weight: 8 },
  { from: "B", to: "D", weight: 1 },
  { from: "B", to: "F", weight: 7 },
  { from: "C", to: "E", weight: 3 },
  { from: "D", to: "E", weight: 2 },
  { from: "D", to: "F", weight: 1 },
  { from: "E", to: "F", weight: 5 },
];

const demoSteps = [
  {
    id: 1,
    node: "A",
    distance: "0",
    action: "Initialize distances",
    description: "Initialize distances (A = 0, others = ∞).",
    reason: "The source node starts at distance zero. Other nodes are initially unreachable.",
    visited: [],
    path: [],
  },
  {
    id: 2,
    node: "A",
    distance: "0",
    action: "Explore neighbors",
    description: "Visit node A and explore its neighbors.",
    reason: "The algorithm begins expanding from the source node.",
    visited: ["A"],
    path: [],
  },
  {
    id: 3,
    node: "B",
    distance: "4",
    action: "Update distances",
    description: "Update distances to B (4) and C (2).",
    reason: "The source provides the initial candidate distances to its neighbors.",
    visited: ["A"],
    path: [],
  },
  {
    id: 4,
    node: "C",
    distance: "2",
    action: "Select closest node",
    description: "Select node C (distance 2).",
    reason: "C has the smallest tentative distance among the unvisited nodes.",
    visited: ["A"],
    path: [],
  },
  {
    id: 5,
    node: "B",
    distance: "4",
    action: "Compare candidate distances",
    description: "Explore B and compare its outgoing routes.",
    reason: "The algorithm compares alternative routes before accepting distance updates.",
    visited: ["A", "C"],
    path: [],
  },
  {
    id: 6,
    node: "D",
    distance: "5",
    action: "Update predecessor",
    description: "Reach D through B with distance 5.",
    reason: "A → B → D has total weight 4 + 1 = 5.",
    visited: ["A", "C", "B"],
    path: [],
  },
  {
    id: 7,
    node: "F",
    distance: "6",
    action: "Complete shortest path",
    description: "Reach F with total distance 6.",
    reason: "The sample shortest route is A → B → D → F, with weight 4 + 1 + 1 = 6.",
    visited: ["A", "C", "B", "D", "F"],
    path: ["A", "B", "D", "F"],
  },
];

export default function RouteLab() {
  const [nodes, setNodes] = useState(sampleNodes);
  const [edges, setEdges] = useState(sampleEdges);
  const [source, setSource] = useState("A");
  const [destination, setDestination] = useState("F");
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [mode, setMode] = useState("normal");
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = demoSteps;
  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  function resetGraph() {
    setIsPlaying(false);
    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setSource("A");
    setDestination("F");
    setStepIndex(0);
    setMode("normal");
    setSelectedNodes([]);
    setEdgeWeight("1");
  }

  function clearGraph() {
    setIsPlaying(false);
    setNodes([]);
    setEdges([]);
    setSource("");
    setDestination("");
    setStepIndex(0);
    setSelectedNodes([]);
    setMode("normal");
  }

  function addNode() {
    if (nodes.length >= 12) {
      window.alert("The demo supports up to 12 nodes.");
      return;
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const id = alphabet.split("").find(
      (letter) => !nodes.some((node) => node.id === letter)
    );

    if (!id) return;

    const positions = [
      { x: 100, y: 85 },
      { x: 300, y: 75 },
      { x: 500, y: 85 },
      { x: 110, y: 280 },
      { x: 300, y: 280 },
      { x: 500, y: 280 },
      { x: 300, y: 175 },
    ];

    const position = positions[nodes.length % positions.length];

    setNodes((current) => [
      ...current,
      { id, ...position },
    ]);

    if (!source) setSource(id);
    if (!destination) setDestination(id);
  }

  function handleNodeClick(id) {
    if (mode === "delete") {
      setNodes((current) => current.filter((node) => node.id !== id));
      setEdges((current) =>
        current.filter((edge) => edge.from !== id && edge.to !== id)
      );

      if (source === id) setSource("");
      if (destination === id) setDestination("");
      setSelectedNodes([]);
      setStepIndex(0);
      setIsPlaying(false);
      return;
    }

    if (mode === "add-edge") {
      if (selectedNodes.includes(id)) {
        setSelectedNodes((current) => current.filter((item) => item !== id));
        return;
      }

      const next = [...selectedNodes, id];

      if (next.length === 2) {
        const [from, to] = next;

        const exists = edges.some(
          (edge) =>
            (edge.from === from && edge.to === to) ||
            (edge.from === to && edge.to === from)
        );

        if (exists) {
          window.alert("These nodes are already connected.");
        } else {
          setEdges((current) => [
            ...current,
            { from, to, weight: Math.max(1, Number(edgeWeight) || 1) },
          ]);
        }

        setSelectedNodes([]);
      } else {
        setSelectedNodes(next);
      }
    }
  }

  function selectStep(index) {
    setIsPlaying(false);
    setStepIndex(index);
  }

  function resetExecution() {
    setIsPlaying(false);
    setStepIndex(0);
  }

  const availableDestinations = nodes.filter(
    (node) => node.id !== source
  );

  return (
    <main className="page route-lab-page">
      <header className="route-heading">
        <p className="eyebrow">INTERACTIVE WORKSPACE</p>
        <h1>
          Route Lab — <span className="gradient-text">Dijkstra's Algorithm</span>
        </h1>
        <p>
          Build a weighted graph, explore node decisions, and learn how
          shortest paths are discovered.
        </p>
      </header>

      <div className="route-feature-strip">
        <div><Network /><span><strong>Real Graphs</strong><small>Create and edit a graph</small></span></div>
        <div><Plus /><span><strong>Step by Step</strong><small>Inspect every decision</small></span></div>
        <div><Link2 /><span><strong>Code & Explanation</strong><small>Understand the logic</small></span></div>
      </div>

      <div className="route-workspace">
        <aside className="lab-panel graph-editor">
          <div className="panel-heading">
            <h3><Network size={18} /> Graph Editor</h3>
            <button className="small-action" onClick={resetGraph}>Load Sample</button>
          </div>

          <p className="editor-description">
            Create nodes and connect them to build your graph.
          </p>

          <div className="editor-tools">
            <button className="tool-button" onClick={addNode}>
              <Plus /> <span>Add Node</span>
            </button>
            <button
              className={`tool-button ${mode === "add-edge" ? "tool-active" : ""}`}
              onClick={() => {
                setSelectedNodes([]);
                setMode(mode === "add-edge" ? "normal" : "add-edge");
              }}
            >
              <Link2 /> <span>Add Edge</span>
            </button>
            <button
              className={`tool-button ${mode === "delete" ? "tool-active" : ""}`}
              onClick={() => {
                setSelectedNodes([]);
                setMode(mode === "delete" ? "normal" : "delete");
              }}
            >
              <Trash2 /> <span>Delete Node</span>
            </button>
            <button className="tool-button" onClick={clearGraph}>
              <X /> <span>Clear</span>
            </button>
          </div>

          <div className="editor-settings">
            <h4>Graph Settings</h4>

            <label>
              Source Node
              <select
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                  setIsPlaying(false);
                  setStepIndex(0);
                }}
              >
                <option value="">Select source</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>{node.id}</option>
                ))}
              </select>
            </label>

            <label>
              Destination Node
              <select
                value={destination}
                onChange={(event) => {
                  setDestination(event.target.value);
                  setIsPlaying(false);
                  setStepIndex(0);
                }}
              >
                <option value="">Select destination</option>
                {availableDestinations.map((node) => (
                  <option key={node.id} value={node.id}>{node.id}</option>
                ))}
              </select>
            </label>

            <label>
              New Edge Weight
              <input
                type="number"
                min="1"
                value={edgeWeight}
                onChange={(event) => setEdgeWeight(event.target.value)}
              />
            </label>
          </div>

          <div className="lab-tip">
            <Lightbulb size={20} />
            <div>
              <strong>Quick tip</strong>
              <p>Choose Add Edge, select two nodes, and set a weight to connect them.</p>
            </div>
          </div>
        </aside>

        <section className="route-center">
          <ExecutionControls
            isPlaying={isPlaying}
            onRun={() => {
              if (!source || !destination || source === destination) {
                window.alert("Choose different source and destination nodes.");
                return;
              }

              if (nodes.length === 0) {
                window.alert("Load or create a graph first.");
                return;
              }

              if (stepIndex >= steps.length - 1) setStepIndex(0);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onNext={() => {
              setIsPlaying(false);
              setStepIndex((current) => Math.min(current + 1, steps.length - 1));
            }}
            onPrevious={() => {
              setIsPlaying(false);
              setStepIndex((current) => Math.max(current - 1, 0));
            }}
            onReset={resetExecution}
            stepIndex={stepIndex}
            totalSteps={steps.length}
          />

          <GraphCanvas
            nodes={nodes}
            edges={edges}
            currentNode={currentStep?.node}
            visitedNodes={currentStep?.visited || []}
            shortestPath={currentStep?.path || []}
            mode={mode}
            selectedNodes={selectedNodes}
            onNodeClick={handleNodeClick}
          />

          <ExecutionSteps
            steps={steps}
            stepIndex={stepIndex}
            onSelectStep={selectStep}
          />
        </section>

        <aside className="route-sidebar">
          <section className="lab-panel explanation-panel">
            <h3>Algorithm Explanation</h3>
            <p>
              Dijkstra repeatedly selects the unvisited node with the
              smallest tentative distance and relaxes its outgoing edges.
            </p>
            <ol>
              <li>Initialize the source distance to zero.</li>
              <li>Select the closest unvisited node.</li>
              <li>Compare distances to its neighbors.</li>
              <li>Update distances when a shorter route is found.</li>
              <li>Continue until the destination is finalized.</li>
            </ol>
          </section>

          <CodePanel />
          <ComplexityPanel />

          <section className="lab-panel result-panel">
            <h3>Demo Result</h3>
            <p>Illustrative sample route</p>
            <strong>A → B → D → F</strong>
            <span>Total weight: 6</span>
            <small>
              This result belongs to the sample graph. Custom graphs will
              need real algorithm execution before their results can be shown.
            </small>
          </section>
        </aside>
      </div>

        <AlgorithmInsights
        nodes={nodes}
        edges={edges}
        steps={steps}
        stepIndex={stepIndex}
        currentStep={currentStep}
        source={source}
        destination={destination}
        shortestPath={currentStep?.path || []}
      />
    </main>
  );
}
