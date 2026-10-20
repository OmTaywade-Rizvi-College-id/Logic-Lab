
import { ChartNoAxesColumnIncreasing } from "lucide-react";

export default function ComplexityPanel() {
  return (
    <section className="lab-panel complexity-panel">
      <h3>
        <ChartNoAxesColumnIncreasing size={18} />
        Complexity Analysis
      </h3>

      <div className="complexity-grid">
        <div>
          <span>Time Complexity</span>
          <strong>O((V + E) log V)</strong>
          <p>Using an adjacency list and priority queue.</p>
        </div>

        <div>
          <span>Space Complexity</span>
          <strong>O(V + E)</strong>
          <p>Graph storage, distances and queue.</p>
        </div>
      </div>
    </section>
  );
}
