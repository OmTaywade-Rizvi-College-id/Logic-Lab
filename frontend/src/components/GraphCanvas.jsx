
import { useState } from "react";

export default function GraphCanvas({
  nodes,
  edges,
  currentNode,
  visitedNodes,
  shortestPath,
  mode,
  selectedNodes,
  onNodeClick,
}) {
  const [showWeights, setShowWeights] = useState(true);

  const pathEdges = shortestPath.map((node, index) => {
    if (index === 0) return null;
    return [shortestPath[index - 1], node].sort().join("-");
  }).filter(Boolean);

  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));

  return (
    <div className="graph-canvas">
      <div className="graph-legend">
        <span><i className="legend-dot unvisited" /> Unvisited</span>
        <span><i className="legend-dot visited" /> Visited</span>
        <span><i className="legend-dot current" /> Current</span>
        <span><i className="legend-line" /> Shortest path</span>
      </div>

      {nodes.length === 0 ? (
        <div className="graph-empty">
          <h3>Your graph is empty</h3>
          <p>Add nodes or load the sample graph to begin.</p>
        </div>
      ) : (
        <svg
          className="graph-svg"
          viewBox="0 0 600 360"
          role="img"
          aria-label="Interactive weighted graph"
        >
          {edges.map((edge, index) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];

            if (!from || !to) return null;

            const key = [edge.from, edge.to].sort().join("-");
            const onPath = pathEdges.includes(key);

            const midpointX = (from.x + to.x) / 2;
            const midpointY = (from.y + to.y) / 2;

            return (
              <g key={`${key}-${index}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={`graph-edge ${onPath ? "path-edge" : ""}`}
                />

                {showWeights && (
                  <g>
                    <rect
                      x={midpointX - 13}
                      y={midpointY - 12}
                      width="26"
                      height="22"
                      rx="6"
                      className="edge-label-bg"
                    />
                    <text
                      x={midpointX}
                      y={midpointY + 4}
                      textAnchor="middle"
                      className="edge-label"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {nodes.map((node) => {
            const isCurrent = node.id === currentNode;
            const isVisited = visitedNodes.includes(node.id);
            const isSelected = selectedNodes.includes(node.id);

            return (
              <g
                key={node.id}
                className="graph-node"
                onClick={() => onNodeClick(node.id)}
                role="button"
                tabIndex={0}
                aria-label={`Node ${node.id}`}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onNodeClick(node.id);
                  }
                }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="23"
                  className={[
                    "node-circle",
                    isVisited ? "node-visited" : "",
                    isCurrent ? "node-current" : "",
                    isSelected ? "node-selected" : "",
                  ].join(" ")}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="node-label"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      <button
        className="weight-toggle"
        onClick={() => setShowWeights((value) => !value)}
      >
        {showWeights ? "Hide weights" : "Show weights"}
      </button>

      {mode === "add-edge" && (
        <p className="graph-hint">
          Select two nodes to connect them.
        </p>
      )}
      {mode === "delete" && (
        <p className="graph-hint">
          Select a node to delete it.
        </p>
      )}
    </div>
  );
}
