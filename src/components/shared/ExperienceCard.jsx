function ExperienceCard() {
  return (
    <div className="flip-wrap reveal-child" style={{ transitionDelay: '0.1s' }}>
      <div className="flip-card">
        <div className="flip-face flip-front glass-panel">
          <span className="watermark">RESEARCH</span>
          <h3>Vertically Integrated Projects (VIP)</h3>
          <p className="mono">UT Dallas</p>
          <p className="mono">Jan 2025 - Present</p>
        </div>
        <div className="flip-face flip-back glass-panel">
          <h3>Current Focus</h3>
          <ul>
            <li>
              Multi-task deep learning pipeline using vision transformers + BERT-based NLP for medical imaging
              report generation.
            </li>
            <li>
              Clinical AI pipeline collaboration under formal data use agreement on a large medical imaging
              dataset.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ExperienceCard
