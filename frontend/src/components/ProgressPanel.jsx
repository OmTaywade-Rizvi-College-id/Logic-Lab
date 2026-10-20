
import {
  Trophy,
  Target,
  Flame,
  TrendingUp,
} from "lucide-react";

export default function ProgressPanel({
  totalChallenges,
  solvedCount,
  attemptedCount,
}) {
  const percentage =
    totalChallenges > 0
      ? Math.round((solvedCount / totalChallenges) * 100)
      : 0;

  const stats = [
    {
      label: "Solved",
      value: `${solvedCount}/${totalChallenges}`,
      icon: Trophy,
      className: "progress-mint",
    },
    {
      label: "Attempted",
      value: attemptedCount,
      icon: Target,
      className: "progress-blue",
    },
    {
      label: "Completion",
      value: `${percentage}%`,
      icon: TrendingUp,
      className: "progress-purple",
    },
  ];

  return (
    <section className="practice-progress-panel">
      <div className="progress-heading">
        <div>
          <p className="eyebrow">YOUR LEARNING JOURNEY</p>
          <h2>Practice Progress</h2>
        </div>

        <div className="progress-trophy">
          <Flame size={23} />
        </div>
      </div>

      <div className="progress-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="progress-stat" key={stat.label}>
              <div className={`progress-stat-icon ${stat.className}`}>
                <Icon size={19} />
              </div>

              <div>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="progress-bar-heading">
        <span>Overall completion</span>
        <strong>{percentage}%</strong>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label="Challenge completion"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="progress-message">
        {percentage === 100 && totalChallenges > 0
          ? "Amazing! You've completed every challenge."
          : solvedCount === 0
            ? "Your journey starts here. Solve your first challenge!"
            : "Keep going! Every challenge strengthens your logic."}
      </p>
    </section>
  );
}
