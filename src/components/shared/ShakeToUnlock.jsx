import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import GiftBox3D from './GiftBox3D'
import SkillOrbit from './SkillOrbit'

function ShakeToUnlock({ isMobile = false }) {
  const [isChestVisible, setIsChestVisible] = useState(true)
  const [isChestMounted, setIsChestMounted] = useState(true)
  const [shakeCount, setShakeCount] = useState(0)
  const [showOrbital, setShowOrbital] = useState(false)
  const [isBurstingIn, setIsBurstingIn] = useState(false)
  const [isBoxOpen, setIsBoxOpen] = useState(false)
  const [isBoxShaking, setIsBoxShaking] = useState(false)
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const wrapperRef = useRef(null)
  const hintRef = useRef(null)
  const orbitalRef = useRef(null)
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window

  const shakesNeeded = 12
  const lastMouseXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const lastDxRef = useRef(0)

  const triggerChestShake = (count) => {
    if (!wrapperRef.current) return

    const intensity = (count / shakesNeeded) * 12
    wrapperRef.current.style.transform = `translateX(${(Math.random() - 0.5) * intensity}px) rotateY(-15deg) rotateZ(${(Math.random() - 0.5) * intensity * 0.5}deg)`

    setIsBoxShaking(true)
    setTimeout(() => setIsBoxShaking(false), 400)

    let hintText = isTouch ? '[ see my skills unfold ]' : '[ see my skills unfold ]'
    if (count >= 9) hintText = '[ almost there! ]'
    else if (count >= 5) hintText = '[ keep going... ]'
    if (hintRef.current) hintRef.current.textContent = hintText

    setTimeout(() => {
      if (wrapperRef.current) wrapperRef.current.style.transform = ''
    }, 80)
  }

  const explodeChest = () => {
    setIsBoxOpen(true)
    setIsChestVisible(false)

    setTimeout(() => {
      if (!sceneRef.current) return
      for (let i = 0; i < 12; i += 1) {
        const spark = document.createElement('div')
        spark.className = 'chest-spark'
        const x = (Math.random() - 0.5) * 180
        const y = 80 + Math.random() * 120
        spark.style.setProperty('--spark-x', `${x}px`)
        spark.style.setProperty('--spark-y', `${y}px`)
        spark.style.left = '50%'
        spark.style.top = '43%'
        spark.style.animationDelay = `${i * 0.03}s`
        sceneRef.current.appendChild(spark)
        setTimeout(() => spark.remove(), 900)
      }
    }, 300)

    setTimeout(() => {
      setIsBurstingIn(true)
      setShowOrbital(true)
      setTimeout(() => setIsBurstingIn(false), 1000)
    }, 500)

    setTimeout(() => {
      if (wrapperRef.current) {
        wrapperRef.current.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 1, 1), opacity 0.3s ease'
        wrapperRef.current.style.transform = 'scale(0) rotateY(-15deg)'
        wrapperRef.current.style.opacity = '0'
      }
    }, 600)

    setTimeout(() => {
      setIsChestMounted(false)
    }, 900)
  }

  const handleChestClick = () => {
    setShakeCount((prev) => {
      const increment = isMobile ? 4 : 3
      const newCount = prev + increment
      triggerChestShake(newCount)
      if (newCount >= shakesNeeded) {
        setTimeout(() => explodeChest(), 100)
      }
      return newCount
    })
  }

  useEffect(() => {
    if (!isChestVisible) return undefined

    const handleMouseMove = (e) => {
      const now = Date.now()
      const dx = e.clientX - lastMouseXRef.current
      const absDx = Math.abs(dx)

      if (
        now - lastTimeRef.current < 180 &&
        absDx > 28 &&
        lastDxRef.current !== 0 &&
        Math.sign(dx) !== Math.sign(lastDxRef.current)
      ) {
        setShakeCount((prev) => {
          const newCount = prev + 1
          triggerChestShake(newCount)
          if (newCount >= shakesNeeded) {
            setTimeout(() => explodeChest(), 100)
          }
          return newCount
        })
      }

      lastDxRef.current = dx
      lastMouseXRef.current = e.clientX
      lastTimeRef.current = now
    }

    const handleDeviceMotion = (e) => {
      const accel = e.accelerationIncludingGravity
      const force = Math.abs(accel.x) + Math.abs(accel.y)
      if (force > 25) {
        setShakeCount((prev) => {
          const newCount = prev + 2
          triggerChestShake(newCount)
          if (newCount >= shakesNeeded) {
            setTimeout(() => explodeChest(), 100)
          }
          return newCount
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('devicemotion', handleDeviceMotion)
    }
  }, [isChestVisible])

  const handleReset = () => {
    setIsChestMounted(true)
    setIsChestVisible(true)
    setShakeCount(0)
    setShowOrbital(false)
    setIsBurstingIn(false)
    setIsBoxOpen(false)
    setIsBoxShaking(false)
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = '1'
      wrapperRef.current.style.transition = ''
      wrapperRef.current.style.transform = ''
    }
    if (hintRef.current) {
      hintRef.current.textContent = isTouch ? '[ see my skills unfold ]' : '[ see my skills unfold ]'
    }
    lastMouseXRef.current = 0
    lastTimeRef.current = 0
    lastDxRef.current = 0
  }

  return (
    <div className="shake-unlock-wrap" ref={containerRef}>
      <motion.div
        animate={{
          height: isChestMounted ? 'auto' : 0,
          opacity: isChestMounted ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        style={{ overflow: 'hidden', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {isChestMounted && (
          <div
            className="chest-container"
            ref={sceneRef}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div ref={wrapperRef} style={{ position: 'relative', width: '100%', flex: 1 }}>
              <GiftBox3D isOpen={isBoxOpen} isShaking={isBoxShaking} onClick={handleChestClick} />
            </div>
            <div className="chest-hint" ref={hintRef}>
              {isTouch ? '[ see my skills unfold ]' : '[ see my skills unfold ]'}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: showOrbital ? 1 : 0,
          y: showOrbital ? 0 : 30,
          height: showOrbital ? 'auto' : 0,
        }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={{ overflow: 'hidden', width: '100%' }}
        ref={orbitalRef}
      >
        <SkillOrbit burstIn={isBurstingIn} />
      </motion.div>

      {showOrbital && (
        <div className="reset-link" onClick={handleReset} style={{ cursor: 'pointer' }}>
          [ reset ]
        </div>
      )}
    </div>
  )
}

export default ShakeToUnlock
