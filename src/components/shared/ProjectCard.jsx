import { motion } from 'framer-motion'
import TiltCard from './TiltCard'

function ProjectCard({
  project,
  index,
  pairIndex,
  hoveredProject,
  setHoveredProject,
  delay = 0,
  disablePush = false,
  forceStaticTilt = false,
}) {
  const isRightColumn = index % 2 === 1
  const hoveredRow = Math.floor(hoveredProject / 2)
  const myRow = Math.floor(index / 2)
  const rowDistance = myRow - hoveredRow
  const isSameRow = hoveredProject !== -1 && pairIndex === hoveredProject
  const isAboveOrBelow = hoveredProject !== -1 && hoveredProject !== index && !isSameRow
  const isMe = hoveredProject === index

  let pushX = 0
  let pushY = 0

  if (!disablePush && !isMe && hoveredProject !== -1) {
    if (isSameRow) {
      pushX = isRightColumn ? 36 : -36
    } else if (isAboveOrBelow) {
      const hoveredIsRightCol = hoveredProject % 2 === 1
      const sameColumn = hoveredIsRightCol === isRightColumn
      if (sameColumn) {
        const dist = Math.abs(rowDistance)
        pushY = rowDistance > 0 ? Math.max(2, 6 - dist * 2) : -Math.max(2, 6 - dist * 2)
      } else {
        const dist = Math.abs(rowDistance)
        pushX = isRightColumn ? Math.max(1, 4 - dist * 2) : -Math.max(1, 4 - dist * 2)
        pushY = rowDistance > 0 ? Math.max(1, 3 - dist) : -Math.max(1, 3 - dist)
      }
    }
  }

  return (
    <motion.div
      className="project-card-motion-wrapper"
      animate={{ x: pushX, y: pushY }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.9 }}
      style={{ position: 'relative' }}
    >
      <TiltCard
        className={`project-card glass-panel reveal-child ${project.award ? 'award-card' : ''}`}
        style={{
          borderColor: `${project.accent}33`,
          '--project-accent': project.accent,
          transitionDelay: `${delay}s`,
          width: '100%',
          boxSizing: 'border-box',
          margin: 0,
        }}
        forceStatic={forceStaticTilt}
        onMouseEnter={() => setHoveredProject(index)}
        onMouseLeave={() => setHoveredProject(-1)}
      >
        {project.award && <span className="award-badge">🏆</span>}
        <div className="card-content">
          <div>
            <p className="mono project-tag" style={{ color: project.accent }}>
              {project.subtitle}
            </p>
            <h3>{project.title}</h3>
            <ul>
              {project.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
          <div className="card-pills">
            {project.links ? (
              <div className="project-links-row">
                {project.links.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.label}
                      className="project-link-btn"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        '--project-accent': project.accent,
                      }}
                    >
                      <Icon />
                      <span>{link.label}</span>
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="project-link-private">[ private repo ]</div>
            )}
            <div className="stack-row">
              {project.stack.map((tech) => (
                <span key={tech} className="stack-pill mono">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default ProjectCard
