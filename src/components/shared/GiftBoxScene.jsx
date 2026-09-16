import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BoxBody from './BoxBody'
import BoxLid from './BoxLid'

function GiftBoxScene({ groupRef, rotationRef, velocityRef, isDraggingRef, isOpen, isShaking, onClick }) {
  useFrame(() => {
    if (!groupRef.current) return

    const group = groupRef.current

    if (!isDraggingRef.current) {
      velocityRef.current.x *= 0.92
      velocityRef.current.y *= 0.92
      rotationRef.current.x += velocityRef.current.x
      rotationRef.current.y += velocityRef.current.y

      if (Math.abs(velocityRef.current.y) < 0.001) {
        rotationRef.current.y += 0.004
      }
    }

    if (!isOpen && !isShaking) {
      group.position.y = Math.sin(Date.now() * 0.001) * 0.08
    } else {
      group.position.y = THREE.MathUtils.lerp(group.position.y, 0, 0.1)
    }

    if (isShaking) {
      group.rotation.z = Math.sin(Date.now() * 0.04) * 0.07
    } else {
      group.rotation.z *= 0.9
    }

    group.rotation.x = rotationRef.current.x
    group.rotation.y = rotationRef.current.y
  })

  return (
    <>
      <ambientLight intensity={1.2} color="#0d2a4a" />
      <directionalLight position={[2, 4, 3]} intensity={1.6} color="#c8e8ff" />
      <pointLight position={[0, 2, 3.5]} intensity={2.2} color="#00E5FF" distance={10} decay={2} />
      <pointLight position={[-2, 1, 2]} intensity={0.8} color="#1a4a7a" distance={7} decay={2} />

      <group ref={groupRef} scale={1.0}>
        <BoxBody onClick={onClick} />
        <BoxLid isOpen={isOpen} />
      </group>
    </>
  )
}

export default GiftBoxScene
