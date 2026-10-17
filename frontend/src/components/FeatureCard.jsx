
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <article className="card">
      <div className="feature-icon">
        <Icon size={21} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

export default FeatureCard;
