import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import GiftBox3D from './GiftBox3D'
import SkillOrbit from './SkillOrbit'
import { REVEAL_DURATION } from './arsenalReveal'

function ShakeToUnlock({ isMobile = false }) {
  const reducedMotion = useReducedMotion()
  const [stage, setStage] = useState('closed')
  const [isBoxShaking, setIsBoxShaking] = useState(false)
  const count = useRef(0)
  const revealRef = useRef({ startedAt: null, origin: null })
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const interact = useCallback((increment) => {
    const later = (callback, delay) => timers.current.push(setTimeout(callback, delay))
    if (revealRef.current.startedAt !== null) return
    count.current += increment
    if (count.current >= 12) {
      revealRef.current.startedAt = performance.now()
      setIsBoxShaking(false)
      setStage('opening')
      later(() => setStage('open'), reducedMotion ? 250 : REVEAL_DURATION * 1000)
    } else {
      setIsBoxShaking(true)
      later(() => setIsBoxShaking(false), 250)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (stage !== 'closed') return
    let lastX = 0, lastTime = 0, lastDx = 0
    const mouseMove = (event) => {
      const now = performance.now(), dx = event.clientX - lastX
      if (now - lastTime < 180 && Math.abs(dx) > 28 && lastDx && Math.sign(dx) !== Math.sign(lastDx)) interact(1)
      lastX = event.clientX
      lastTime = now
      lastDx = dx
    }
    const deviceMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity
      if (acceleration && Math.abs(acceleration.x) + Math.abs(acceleration.y) > 25) interact(2)
    }
    document.addEventListener('mousemove', mouseMove)
    window.addEventListener('devicemotion', deviceMotion)
    return () => {
      document.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('devicemotion', deviceMotion)
    }
  }, [stage, interact]) // The ref guards duplicate unlocks during rapid input.

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    count.current = 0
    revealRef.current = { startedAt: null, origin: null }
    setIsBoxShaking(false)
    setStage('closed')
  }

  return (
    <div className="shake-unlock-wrap">
      <div className={`arsenal-reveal-stage ${stage}`}>
        <SkillOrbit revealRef={revealRef} stage={stage} />
        {stage !== 'open' && (
          <div className="arsenal-box-layer" aria-hidden={stage === 'opening'}>
            <div className="chest-container">
              <GiftBox3D isOpen={stage === 'opening'} isShaking={isBoxShaking}
                revealRef={revealRef} reducedMotion={reducedMotion}
                onClick={() => interact(isMobile ? 4 : 3)} />
              <div className="chest-hint" style={{ opacity: stage === 'closed' ? 0.85 : 0 }}>
                [ see my skills unfold ]
              </div>
            </div>
          </div>
        )}
      </div>
      {stage === 'open' && <div className="reset-link" onClick={reset} style={{ cursor: 'pointer' }}>[ reset ]</div>}
    </div>
  )
}

export default ShakeToUnlock
