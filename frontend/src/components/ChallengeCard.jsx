
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code2,
  LockKeyhole,
} from "lucide-react";

export default function ChallengeCard({
  challenge,
  onSolve,
  isSolved = false,
}) {
  const difficultyClass = challenge.difficulty
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <article className="challenge-card">
      <div className="challenge-card-top">
        <span className={`challenge-difficulty ${difficultyClass}`}>
          {challenge.difficulty}
        </span>

        {isSolved ? (
          <span className="challenge-solved">
            <CheckCircle2 size={15} />
            Solved
          </span>
        ) : (
          <span className="challenge-points">
            +{challenge.points} XP
          </span>
        )}
      </div>

      <div className="challenge-card-icon">
        <Code2 size={23} />
      </div>

      <h3>{challenge.title}</h3>

      <p className="challenge-description">
        {challenge.description}
      </p>

      <div className="challenge-tags">
        <span>{challenge.category}</span>
        <span>
          <Clock3 size={13} />
          {challenge.estimatedTime}
        </span>
      </div>

      <div className="challenge-card-footer">
        <span className="challenge-id">
          {challenge.id}
        </span>

        <button
          className="challenge-solve-button"
          onClick={() => onSolve(challenge)}
        >
          {isSolved ? "Practice Again" : "Solve Challenge"}
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}
