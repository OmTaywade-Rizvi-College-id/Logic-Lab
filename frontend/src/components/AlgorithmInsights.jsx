
import {
  Activity,
  CheckCircle2,
  CircleDot,
  GitBranch,
  Route,
  Zap,
} from "lucide-react";

const defaultSteps = [
  {
    title: "Initialize distances",
    detail: "Set the source distance to zero and all other distances to infinity.",
  },
  {
    title: "Explore the source",
    detail: "Start from the source node and examine its connected neighbors.",
  },
  {
    title: "Relax edges",
    detail: "Compare alternative distances and update a neighbor when a shorter route is found.",
  },
  {
    title: "Select the next node",
    detail: "Choose the unvisited node with the smallest tentative distance.",
  },
  {
    title: "Finalize the route",
    detail: "Reconstruct the shortest path using the predecessor information.",
  },
];

export default function AlgorithmInsights({
  nodes = [],
  edges = [],
  steps = [],
  stepIndex = 0,
  currentStep = null,
  source = "",
  destination = "",
  shortestPath = [],
  totalDistance = null,
}) {
  const activeStep = steps[stepIndex] || currentStep;

  const visitedCount = new Set(activeStep?.visited || []).size;

  const route =
    shortestPath.length > 0
      ? shortestPath
      : activeStep?.path || [];

  const hasResult =
    totalDistance !== null && totalDistance !== undefined;

  const insights = [
    {
      icon: CircleDot,
      label: "Graph Nodes",
      value: nodes.length,
      detail: "Vertices in your graph",
    },
    {
      icon: GitBranch,
      label: "Graph Edges",
      value: edges.length,
      detail: "Connections between nodes",
    },
    {
      icon: Activity,
      label: "Nodes Visited",
      value: visitedCount,
      detail: "At the current step",
    },
    {
      icon: Zap,
      label: "Execution Step",
      value: `${Math.min(stepIndex + 1, Math.max(steps.length, 1))} / ${Math.max(steps.length, 1)}`,
      detail: "Current progress",
    },
  ];

  return (
    <section className="algorithm-insights">
      <div className="insights-heading">
        <div>
          <p className="eyebrow">UNDER THE HOOD</p>
          <h2>Algorithm Insights</h2>
          <p>
            Follow the algorithm's progress and understand
            how each decision contributes to the final result.
          </p>
        </div>

        <span className="insights-status">
          <span className="status-dot" />
          Step-by-step view
        </span>
      </div>

      <div className="insight-stats">
        {insights.map(({ icon: Icon, label, value, detail }) => (
          <article className="insight-stat" key={label}>
            <div className="insight-stat-top">
              <span>{label}</span>
              <Icon size={18} />
            </div>

            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </div>

      <div className="insights-bottom">
        <article className="lab-panel timeline-panel">
          <div className="insights-card-heading">
            <div>
              <h3>Execution Timeline</h3>
              <p>Choose a step to inspect its explanation.</p>
            </div>

            <Route size={20} />
          </div>

          <div className="timeline-list">
            {defaultSteps.map((step, index) => {
              const isActive =
                activeStep?.action === step.title ||
                activeStep?.description === step.title;

              const isCurrent = index === stepIndex;
              const isCompleted = index < stepIndex;

              return (
                <div
                  className={`timeline-item ${
                    isCurrent || isActive ? "timeline-active" : ""
                  } ${isCompleted ? "timeline-completed" : ""}`}
                  key={step.title}
                >
                  <div className="timeline-marker">
                    {isCompleted ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="timeline-copy">
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="lab-panel decision-panel">
          <div className="insights-card-heading">
            <div>
              <h3>Decision Inspector</h3>
              <p>What is happening right now?</p>
            </div>

            <Activity size={20} />
          </div>

          <div className="decision-highlight">
            <span>STEP {stepIndex + 1}</span>
            <h4>
              {activeStep?.action || activeStep?.description ||
                "Ready to explore"}
            </h4>

            <p>
              {activeStep?.description ||
                "Run the algorithm or select an execution step to see what changes."}
            </p>
          </div>

          <div className="decision-facts">
            <div>
              <span>Source</span>
              <strong>{source || "Not selected"}</strong>
            </div>

            <div>
              <span>Destination</span>
              <strong>{destination || "Not selected"}</strong>
            </div>

            <div>
              <span>Current node</span>
              <strong>{activeStep?.node || "—"}</strong>
            </div>

            <div>
              <span>Current distance</span>
              <strong>{activeStep?.distance ?? "—"}</strong>
            </div>
          </div>

          <div className="decision-reason">
            <strong>Why this matters</strong>
            <p>
              {activeStep?.reason ||
                "Each step helps explain how Dijkstra explores the graph."}
            </p>
          </div>

          <div className="decision-result">
            <span>Shortest path discovered</span>

            <strong>
              {route.length > 0
                ? route.join(" → ")
                : "Not available yet"}
            </strong>

            {hasResult && (
              <small>Total distance: {totalDistance}</small>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
