import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SKILL_CATEGORY_MAP } from '../../constants/data'

function getSkillCategory(name) {
  return SKILL_CATEGORY_MAP[name] ?? 'Dev Tool'
}

function SkillOrbit({ burstIn = false }) {
  const [time, setTime] = useState(0)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768,
  )
  const lastTickRef = useRef(0)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let raf
    const frameIntervalMs = isMobile ? 33 : 16
    const update = (now) => {
      if (now - lastTickRef.current >= frameIntervalMs) {
        setTime(now / 1000)
        lastTickRef.current = now
      }
      raf = window.requestAnimationFrame(update)
    }
    raf = window.requestAnimationFrame(update)
    return () => window.cancelAnimationFrame(raf)
  }, [isMobile])

  const rings = [
    {
      className: 'ring ring-inner',
      radius: isMobile ? 18 : 23,
      speed: 0.26,
      category: 'Core Languages',
      items: isMobile
        ? [
            { name: 'Python', color: 'cyan', hint: 'Data science, APIs, ML' },
            { name: 'Java', color: 'cyan', hint: 'OOP and systems foundations' },
            { name: 'C++', color: 'cyan', hint: 'Performance and hardware work' },
            { name: 'Git', color: 'free', hint: 'Version control' },
          ]
        : [
            { name: 'Python', color: 'cyan', hint: 'Data science, APIs, ML' },
            { name: 'Java', color: 'cyan', hint: 'OOP and systems foundations' },
            { name: 'C++', color: 'cyan', hint: 'Performance and hardware work' },
          ],
    },
    {
      className: 'ring ring-mid',
      radius: isMobile ? 27.5 : 36,
      speed: -0.2,
      category: 'Frontend/Backend',
      items: isMobile
        ? [
            { name: 'React.js', color: 'violet', hint: 'Modern UI development' },
            { name: 'Vite', color: 'violet', hint: 'Fast dev and bundling' },
            { name: 'Express.js', color: 'violet', hint: 'Node API services' },
            { name: 'Flask', color: 'violet', hint: 'Python microservices' },
            { name: 'Docker', color: 'free', hint: 'Containerization' },
          ]
        : [
            { name: 'React.js', color: 'violet', hint: 'Modern UI development' },
            { name: 'React Native', color: 'violet', hint: 'Mobile UI systems' },
            { name: 'Vite', color: 'violet', hint: 'Fast dev and bundling' },
            { name: 'Express.js', color: 'violet', hint: 'Node API services' },
            { name: 'Flask', color: 'violet', hint: 'Python microservices' },
            { name: 'Expo', color: 'violet', hint: 'Cross-platform native builds' },
          ],
    },
    {
      className: 'ring ring-outer',
      radius: isMobile ? 37 : 48,
      speed: 0.14,
      category: 'AI/ML',
      items: isMobile
        ? [
            { name: 'PyTorch', color: 'white', hint: 'Model training + inference' },
            { name: 'YOLOv8', color: 'white', hint: 'Fast object detection' },
            { name: 'scikit-learn', color: 'white', hint: 'Classical ML pipelines' },
            { name: 'React Native', color: 'violet', hint: 'Mobile UI systems' },
            { name: 'Expo', color: 'violet', hint: 'Cross-platform native builds' },
            { name: 'Linux', color: 'free', hint: 'OS & Systems' },
          ]
        : [
            { name: 'PyTorch', color: 'white', hint: 'Model training + inference' },
            { name: 'YOLOv8', color: 'white', hint: 'Fast object detection' },
            { name: 'scikit-learn', color: 'white', hint: 'Classical ML pipelines' },
          ],
    },
  ]

  const freeOrbit = isMobile
    ? []
    : [
        { name: 'Git', radius: 55, speed: -0.28, offset: 0.25 * Math.PI },
        { name: 'Docker', radius: 58, speed: 0.24, offset: 1.4 * Math.PI },
        { name: 'Linux', radius: 53, speed: -0.18, offset: 0.9 * Math.PI },
      ]

  let skillDelayIndex = 0

  return (
    <div className="skills-orbit-wrap">
      <div
        className={`skills-orbit ${burstIn ? 'skills-bursting' : ''}`}
        role="img"
        aria-label="Orbital skill visualization"
      >
        {rings.map((ring) => (
          <motion.div
            key={ring.className}
            className={ring.className}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {rings.flatMap((ring) =>
          ring.items.map((item, index) => {
            const baseAngle = (index / ring.items.length) * Math.PI * 2
            const angle = baseAngle + time * ring.speed
            const x = 50 + ring.radius * Math.cos(angle)
            const y = 50 + ring.radius * Math.sin(angle)

            return (
              <div
                key={`${ring.className}-${item.name}`}
                className={`skill-node ${item.color}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  '--skill-delay': `${skillDelayIndex++ * 0.05}s`,
                }}
              >
                <span>{item.name}</span>
                <small>{item.hint}</small>
                <em className="skill-tooltip">{getSkillCategory(item.name)}</em>
              </div>
            )
          }),
        )}

        {freeOrbit.map((item) => {
          const angle = item.offset + time * item.speed
          const x = 50 + item.radius * Math.cos(angle)
          const y = 50 + item.radius * Math.sin(angle)
          return (
            <div
              key={item.name}
              className="skill-node free"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                '--skill-delay': `${skillDelayIndex++ * 0.05}s`,
              }}
            >
              <span>{item.name}</span>
              <em className="skill-tooltip">Tools</em>
            </div>
          )
        })}
      </div>

      <p className="skills-interests">
        AI/ML · Full-Stack · Assistive Tech · Local AI Infrastructure · Hardware
      </p>
    </div>
  )
}

export default SkillOrbit
