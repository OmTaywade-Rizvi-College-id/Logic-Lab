
import { ArrowUpRight, Network } from "lucide-react";
import { Link } from "react-router-dom";

function AlgorithmCard({
  title,
  category,
  difficulty,
  description,
  application,
}) {
  return (
    <article className="card">
      <div className="algorithm-icon">
        <Network size={22} />
      </div>

      <div className="filter-row">
        <span className="tag">{category}</span>
        <span className="tag">{difficulty}</span>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <p style={{ marginTop: 12 }}>
        <strong>Application:</strong> {application}
      </p>

      <Link to="/route-lab" className="card-link">
        Explore algorithm <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}

export default AlgorithmCard;
