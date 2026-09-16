import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

function WireframeCore({ globeStateRef }) {
  const meshRef = useRef(null)

  useFrame(() => {
    if (!meshRef.current) return

    const { quat } = globeStateRef.current
    meshRef.current.quaternion.set(quat.x, quat.y, quat.z, quat.w)
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.2, 1]} />
      <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.72} />
    </mesh>
  )
}

function HeroWireframe({ className = 'hero-wireframe', style }) {
  const containerRef = useRef(null)
  const globeStateRef = useRef({
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    quat: { x: 0, y: 0, z: 0, w: 1 },
    angularVelocity: { x: 0, y: 0, z: 0 },
  })

  const friction = 0.92
  const dragSensitivity = 0.005
  const autoRotateSpeed = 0.003

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const heroSection = container.closest('.hero-section')
    if (!heroSection) return undefined

    const multiplyQuat = (a, b) => ({
      x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
      y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
      z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
      w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    })

    const axisAngleQuat = (ax, ay, az, angle) => {
      const s = Math.sin(angle / 2)
      return {
        x: ax * s,
        y: ay * s,
        z: az * s,
        w: Math.cos(angle / 2),
      }
    }

    const normalizeQuat = (q) => {
      const len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w) || 1
      return {
        x: q.x / len,
        y: q.y / len,
        z: q.z / len,
        w: q.w / len,
      }
    }

    const applyAngularVelocity = () => {
      const state = globeStateRef.current

      if (state.angularVelocity.x !== 0) {
        const qx = axisAngleQuat(1, 0, 0, state.angularVelocity.x)
        state.quat = normalizeQuat(multiplyQuat(qx, state.quat))
      }

      if (state.angularVelocity.y !== 0) {
        const qy = axisAngleQuat(0, 1, 0, state.angularVelocity.y)
        state.quat = normalizeQuat(multiplyQuat(qy, state.quat))
      }

      if (state.angularVelocity.z !== 0) {
        const qz = axisAngleQuat(0, 0, 1, state.angularVelocity.z)
        state.quat = normalizeQuat(multiplyQuat(qz, state.quat))
      }
    }

    const handleMouseDown = (e) => {
      if (e.target.closest('a, button')) return

      globeStateRef.current.isDragging = true
      globeStateRef.current.lastMouseX = e.clientX
      globeStateRef.current.lastMouseY = e.clientY
      globeStateRef.current.angularVelocity.x = 0
      globeStateRef.current.angularVelocity.y = 0
      globeStateRef.current.angularVelocity.z = 0
      container.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e) => {
      if (!globeStateRef.current.isDragging) return

      const dx = e.clientX - globeStateRef.current.lastMouseX
      const dy = e.clientY - globeStateRef.current.lastMouseY

      globeStateRef.current.angularVelocity.x = dy * dragSensitivity
      globeStateRef.current.angularVelocity.y = dx * dragSensitivity
      globeStateRef.current.angularVelocity.z = 0

      applyAngularVelocity()

      globeStateRef.current.lastMouseX = e.clientX
      globeStateRef.current.lastMouseY = e.clientY
    }

    const handleMouseUp = () => {
      globeStateRef.current.isDragging = false
      container.style.cursor = 'grab'
    }

    const handleHeroMouseMove = (e) => {
      if (globeStateRef.current.isDragging) return

      const rect = heroSection.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)

      const clampedX = Math.max(-1, Math.min(1, dx))
      const clampedY = Math.max(-1, Math.min(1, dy))

      globeStateRef.current.angularVelocity.x += clampedY * 0.00035
      globeStateRef.current.angularVelocity.y += clampedX * 0.00055
    }

    const handleMouseLeave = () => {
      if (globeStateRef.current.isDragging) {
        globeStateRef.current.isDragging = false
        container.style.cursor = 'grab'
      }
    }

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      globeStateRef.current.isDragging = true
      globeStateRef.current.lastMouseX = touch.clientX
      globeStateRef.current.lastMouseY = touch.clientY
      globeStateRef.current.angularVelocity.x = 0
      globeStateRef.current.angularVelocity.y = 0
      globeStateRef.current.angularVelocity.z = 0
    }

    const handleTouchMove = (e) => {
      if (!globeStateRef.current.isDragging) return

      e.preventDefault()
      const touch = e.touches[0]
      const dx = touch.clientX - globeStateRef.current.lastMouseX
      const dy = touch.clientY - globeStateRef.current.lastMouseY

      globeStateRef.current.angularVelocity.x = dy * dragSensitivity
      globeStateRef.current.angularVelocity.y = dx * dragSensitivity
      globeStateRef.current.angularVelocity.z = 0

      applyAngularVelocity()

      globeStateRef.current.lastMouseX = touch.clientX
      globeStateRef.current.lastMouseY = touch.clientY
    }

    const handleTouchEnd = () => {
      globeStateRef.current.isDragging = false
    }

    let rafId

    const animate = () => {
      if (!globeStateRef.current.isDragging) {
        applyAngularVelocity()

        globeStateRef.current.angularVelocity.x *= friction
        globeStateRef.current.angularVelocity.y *= friction
        globeStateRef.current.angularVelocity.z *= friction

        const speed = Math.abs(globeStateRef.current.angularVelocity.y)
        if (speed < autoRotateSpeed) {
          globeStateRef.current.angularVelocity.y = autoRotateSpeed
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    container.style.cursor = 'grab'

    heroSection.addEventListener('mousedown', handleMouseDown)
    heroSection.addEventListener('mousemove', handleHeroMouseMove)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    rafId = requestAnimationFrame(animate)

    return () => {
      heroSection.removeEventListener('mousedown', handleMouseDown)
      heroSection.removeEventListener('mousemove', handleHeroMouseMove)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className={className} style={style} ref={containerRef} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <WireframeCore globeStateRef={globeStateRef} />
      </Canvas>
    </div>
  )
}

export default HeroWireframe
