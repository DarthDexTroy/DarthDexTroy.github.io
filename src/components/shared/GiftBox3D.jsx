import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import GiftBoxScene from './GiftBoxScene'

function GiftBox3D({ isOpen, isShaking, onClick, revealRef, reducedMotion }) {
  const isDragging = useRef(false)
  const pointerMoved = useRef(false)
  const startPointer = useRef({ x: 0, y: 0 })
  const lastPointer = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0.08, y: -0.25, z: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const groupRef = useRef(null)

  const handleBoxClick = () => {
    if (typeof onClick === 'function') onClick()
  }

  const onPointerDown = (e) => {
    pointerMoved.current = false
    if (isOpen) return
    isDragging.current = true
    startPointer.current = { x: e.clientX, y: e.clientY }
    lastPointer.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!isDragging.current) return

    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    const movedX = Math.abs(e.clientX - startPointer.current.x)
    const movedY = Math.abs(e.clientY - startPointer.current.y)
    if (movedX > 5 || movedY > 5) pointerMoved.current = true

    rotation.current.y += dx * 0.012
    rotation.current.x += dy * 0.012
    velocity.current = { x: dy * 0.012, y: dx * 0.012 }
    lastPointer.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e) => {
    isDragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
    if (!pointerMoved.current) {
      handleBoxClick()
    }
  }

  return (
    <div
      className="chest-canvas-wrap"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ touchAction: 'none', width: '100%', height: '100%', position: 'relative' }}
    >
      <Canvas
        camera={{ position: [0, 1.0, 5.2], fov: 42 }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        style={{
          width: '100%',
          height: 'calc(100% + 140px)',
          position: 'absolute',
          top: '-140px',
          display: 'block',
          overflow: 'visible',
          cursor: 'grab',
        }}
        gl={{ alpha: true }}
      >
        <GiftBoxScene
          revealRef={revealRef}
          reducedMotion={reducedMotion}
          groupRef={groupRef}
          rotationRef={rotation}
          velocityRef={velocity}
          isDraggingRef={isDragging}
          isOpen={isOpen}
          isShaking={isShaking}
          onClick={handleBoxClick}
        />
      </Canvas>
    </div>
  )
}

export default GiftBox3D
