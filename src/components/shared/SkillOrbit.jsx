import { useReducedMotion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import { EMERGE_AT, revealTime, progress, easeOut } from './arsenalReveal'
import { SKILL_CATEGORY_MAP } from '../../constants/data'
import { spaceMobilePills } from './mobileSkillLayout'

// Short labels occupy the smallest orbit; wider labels get more circumference.
const RINGS = [
  {
    className: 'ring-inner', fraction: 0.28, period: 40, phase: -Math.PI / 2,
    items: [
      { name: 'Java', color: 'cyan', hint: 'OOP and systems foundations' },
      { name: 'C++', color: 'cyan', hint: 'Performance and hardware work' },
      { name: 'Git', color: 'free', hint: 'Version control' },
    ],
  },
  {
    className: 'ring-mid', fraction: 0.63, period: 58, phase: -Math.PI / 5,
    items: [
      { name: 'Python', color: 'cyan', hint: 'Data science, APIs, ML' },
      { name: 'Vite', color: 'violet', hint: 'Fast dev and bundling' },
      { name: 'Flask', color: 'violet', hint: 'Python microservices' },
      { name: 'Expo', color: 'violet', hint: 'Cross-platform native builds' },
      { name: 'Linux', color: 'free', hint: 'OS & Systems' },
    ],
  },
  {
    className: 'ring-outer', fraction: 1, period: 80, phase: -Math.PI / 2,
    items: [
      { name: 'React.js', color: 'violet', hint: 'Modern UI development' },
      { name: 'React Native', color: 'violet', hint: 'Mobile UI systems' },
      { name: 'Express.js', color: 'violet', hint: 'Node API services' },
      { name: 'PyTorch', color: 'white', hint: 'Model training + inference' },
      { name: 'YOLOv8', color: 'white', hint: 'Fast object detection' },
      { name: 'scikit-learn', color: 'white', hint: 'Classical ML pipelines' },
      { name: 'Docker', color: 'free', hint: 'Containerization' },
    ],
  },
]

function SkillOrbit({ revealRef, stage }) {
  const orbitRef = useRef(null)
  const elapsedRef = useRef(0)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const orbit = orbitRef.current
    const pills = [...orbit.querySelectorAll('.skill-node')]
    const paths = [...orbit.querySelectorAll('.ring')]
    let centerX = 0
    let centerY = 0
    let radii = [0, 0, 0]
    let verticalRadii = [0, 0, 0]
    let mobileSizes = null
    let mobileOffsets = []
    let frameId
    let previousTime
    if (stage === 'closed') elapsedRef.current = 0
    const order = ['Python', 'React.js', 'PyTorch', 'Java', 'C++',
      ...RINGS.flatMap((ring) => ring.items.map((item) => item.name))
        .filter((name) => !['Python', 'React.js', 'PyTorch', 'Java', 'C++'].includes(name))]


    const paint = () => {
      const time = revealTime(revealRef)
      const entering = stage !== 'open' && !reducedMotion
      const bounds = entering ? orbit.getBoundingClientRect() : null
      const sourceX = entering && revealRef.current.origin ? (revealRef.current.origin.x - bounds.left) * orbit.clientWidth / bounds.width : centerX
      const sourceY = entering && revealRef.current.origin ? (revealRef.current.origin.y - bounds.top) * orbit.clientHeight / bounds.height : centerY
      const ringProgress = entering ? easeOut(progress(time, EMERGE_AT, 0.9)) : 1
      paths.forEach((path) => {
        path.style.opacity = ringProgress
        path.style.transform = `translate(${(sourceX - centerX) * (1 - ringProgress)}px, ${(sourceY - centerY) * (1 - ringProgress)}px) scale(${ringProgress})`
      })
      let index = 0
      const targets = []
      RINGS.forEach((ring, ringIndex) => {
        const phase = ring.phase + (reducedMotion ? 0 : elapsedRef.current * Math.PI * 2 / ring.period)
        ring.items.forEach((item, slot) => {
          const angle = phase + slot * Math.PI * 2 / ring.items.length
          const pill = pills[index++]
          const destinationX = centerX + radii[ringIndex] * Math.cos(angle)
          const destinationY = centerY + verticalRadii[ringIndex] * Math.sin(angle)
          const arrival = entering ? progress(time, EMERGE_AT + order.indexOf(item.name) * 0.055, 0.62) : 1
          // A small spring overshoot settles onto the continuously moving target.
          const p = progress(arrival, 0.18, 0.82) - 1
          const travel = 1 + 1.6 * p ** 3 + 0.6 * p ** 2
          const lift = arrival < 0.18 ? 24 * easeOut(arrival / 0.18) : 24 * (1 - travel)
          const x = sourceX + (destinationX - sourceX) * travel
          const y = sourceY + (destinationY - sourceY) * travel - lift
          if (mobileSizes) targets.push({ x, y })
          if (!mobileSizes || entering) {
            pill.style.left = `${x}px`
            pill.style.top = `${y}px`
          }
          pill.style.opacity = Math.min(1, arrival * 4)
          if (arrival < 1) {
            pill.style.transform = `translate(-50%, -50%) scale(calc(var(--skill-scale, 1) * ${easeOut(arrival)}))`
          } else pill.style.removeProperty('transform')
        })
      })
      if (mobileSizes && !entering) {
        const positions = spaceMobilePills(targets, mobileSizes, centerX * 2, centerY * 2, mobileOffsets)
        positions.forEach(({ x, y }, i) => {
          pills[i].style.left = `${x}px`
          pills[i].style.top = `${y}px`
        })
      }
    }

    const measure = () => {
      centerX = orbit.clientWidth / 2
      centerY = orbit.clientHeight / 2
      // Circumscribed pill bounds keep neighboring rings separate at EVERY
      // angle, including hover/burst growth. Fit the orbit before animating it.
      const sizes = pills.map((pill) => [pill.offsetWidth, pill.offsetHeight])
      if (window.matchMedia('(max-width: 768px)').matches) {
        mobileSizes = sizes.map(([w, h]) => [w * 1.1, h * 1.1])
        mobileOffsets = []
        // Keep readable pills at full size. Use vertical space for the mobile
        // ellipses, reserving the largest pill's bounds plus reveal overshoot.
        const safeX = Math.max(0, centerX - 8 - Math.max(...sizes.map(([w]) => w)) * 1.1 / 2)
        const safeY = Math.max(0, centerY - 24 - Math.max(...sizes.map(([, h]) => h)) * 1.1 / 2)
        radii = RINGS.map((ring) => safeX * ring.fraction)
        verticalRadii = RINGS.map((ring) => safeY * ring.fraction)
        orbit.style.setProperty('--skill-scale', 1)
        paths.forEach((path, index) => {
          const width = radii[index] * 2 + 1
          const height = verticalRadii[index] * 2 + 1
          Object.assign(path.style, {
            width: `${width}px`, height: `${height}px`,
            marginLeft: `${-width / 2}px`, marginTop: `${-height / 2}px`,
          })
        })
        paint()
        return
      }
      mobileSizes = null
      // Keep the previous pill sizing; use the extra desktop space for radii.
      const sizingRatio = Math.min(1, 780 / orbit.clientWidth)
      const safeRadiusFor = (scale, ratio = 1) => Math.max(0, Math.min(
        centerX * ratio - 24 - Math.max(...sizes.map(([width]) => width)) * scale * 1.1 / 2,
        centerY * ratio - 24 - Math.max(...sizes.map(([, height]) => height)) * scale * 1.1 / 2,
      ))
      const clearance = 6
      const fit = (scale) => {
        let index = 0
        const envelopes = RINGS.map((ring) => Math.max(...ring.items.map(() => {
          const [width, height] = sizes[index++]
          return Math.hypot(width, height) * scale * 1.1 / 2
        })))
        const result = envelopes.map((extent, i) =>
          (2 * extent + clearance) / (2 * Math.sin(Math.PI / RINGS[i].items.length)))
        for (let i = 1; i < result.length; i++) {
          result[i] = Math.max(result[i], result[i - 1] + envelopes[i - 1] + envelopes[i] + clearance)
        }
        const safeRadius = safeRadiusFor(scale, sizingRatio)
        return { result, spare: safeRadius - result[2] }
      }
      let low = 0
      let high = 1
      for (let i = 0; i < 16; i++) {
        const middle = (low + high) / 2
        if (fit(middle).spare >= 0) low = middle
        else high = middle
      }
      const scale = fit(1).spare >= 0 ? 1 : low
      const { result, spare } = fit(scale)
      radii = result.map((radius, i) => radius + Math.max(0, spare) * RINGS[i].fraction)
      const enlargement = Math.min(1.225, safeRadiusFor(scale) / radii[2])
      radii = radii.map((radius) => radius * enlargement)
      verticalRadii = radii
      orbit.style.setProperty('--skill-scale', scale)
      paths.forEach((path, index) => {
        const diameter = radii[index] * 2 + 1
        Object.assign(path.style, {
          width: `${diameter}px`, height: `${diameter}px`,
          marginLeft: `${-diameter / 2}px`, marginTop: `${-diameter / 2}px`,
        })
      })
      paint()
    }

    const tick = (now) => {
      if (previousTime !== undefined) elapsedRef.current += Math.min(now - previousTime, 64) / 1000
      previousTime = now
      paint()
      frameId = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(orbit)
    pills.forEach((pill) => observer.observe(pill))
    measure()
    if (!reducedMotion) frameId = requestAnimationFrame(tick)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameId)
    }
  }, [reducedMotion, revealRef, stage])

  return (
    <div className="skills-orbit-wrap">
      <div ref={orbitRef} className="skills-orbit"
        role="img" aria-label="Orbital skill visualization">
        {RINGS.map((ring) => (
          <div key={ring.className} className={`ring ${ring.className}`} />
        ))}
        {RINGS.flatMap((ring) => ring.items.map((item) => (
          <div key={item.name} className={`skill-node ${item.color}`} data-ring={ring.className}>
            <span>{item.name}</span>
            <small>{item.hint}</small>
            <em className="skill-tooltip">{SKILL_CATEGORY_MAP[item.name] ?? 'Dev Tool'}</em>
          </div>
        )))}
      </div>
      <p className="skills-interests">
        AI/ML · Full-Stack · Assistive Tech · Local AI Infrastructure · Hardware
      </p>
    </div>
  )
}

export default SkillOrbit
