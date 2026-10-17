
export default function ExecutionSteps({
  steps,
  stepIndex,
  onSelectStep,
}) {
  const currentStep = steps[stepIndex];

  return (
    <section className="execution-panel">
      <div className="panel-heading">
        <h3>Execution Steps</h3>
        <span>
          Step {steps.length ? stepIndex + 1 : 0} of {steps.length}
        </span>
      </div>

      <div className="execution-content">
        <div className="step-list">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={`step-item ${
                index === stepIndex ? "active" : ""
              }`}
              onClick={() => onSelectStep(index)}
            >
              <span className="step-number">{index + 1}</span>
              <span>{step.description}</span>
            </button>
          ))}
        </div>

        <div className="step-details">
          <h4>Current Step Details</h4>

          {currentStep ? (
            <>
              <p><span>Action</span>{currentStep.action}</p>
              <p><span>Node</span>{currentStep.node || "—"}</p>
              <p><span>Distance</span>{currentStep.distance}</p>
              <p><span>Reason</span>{currentStep.reason}</p>
            </>
          ) : (
            <p>Load a graph to view execution details.</p>
          )}
        </div>
      </div>
    </section>
  );
}
