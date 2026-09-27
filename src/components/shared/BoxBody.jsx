import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { revealTime, progress, easeOut } from './arsenalReveal'
import { Edges } from '@react-three/drei'

function BoxBody({ onClick, revealRef, reducedMotion }) {
  const body = useRef(null)
  const clasp = useRef(null)
  const bands = useRef([])
  useFrame(() => {
    const time = revealTime(revealRef)
    const unlock = easeOut(progress(time, 0, 0.22))
    const exit = easeOut(progress(time, 1.5, 0.85))
    clasp.current.position.z = 0.76 + unlock * 0.13
    clasp.current.position.y = -unlock * 0.12
    clasp.current.rotation.x = -unlock * 0.5
    clasp.current.material.emissiveIntensity = 0.8 + Math.sin(progress(time, 0, 0.3) * Math.PI) * 3
    const charge = Math.sin(progress(time, 0.22, 0.65) * Math.PI)
    bands.current.forEach((band) => { band.material.emissiveIntensity = 0.9 + charge * 3 })
    body.current.scale.setScalar(1 - exit * 0.22)
    body.current.position.y = -exit * 0.22
    body.current.traverse((object) => {
      if (object.material && object.material.opacity !== undefined) {
        if (object.material.userData.initialOpacity === undefined) object.material.userData.initialOpacity = object.material.opacity
        object.material.transparent = true
        object.material.opacity = object.material.userData.initialOpacity * (reducedMotion ? 1 - progress(time, 0, 0.25) : 1 - exit)
      }
    })
  })
  return (
    <group ref={body}>
      <mesh onClick={onClick}>
        <boxGeometry args={[2, 1.8, 1.5]} />
        <meshStandardMaterial
          color="#0e2d52"
          roughness={0.25}
          metalness={0.45}
          emissive="#091e38"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh>
        <boxGeometry args={[2.04, 1.84, 1.54]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges color="#00E5FF" lineWidth={2} />
      </mesh>

      <mesh ref={(node) => { bands.current[0] = node }} position={[0, 0, 0]}>
        <boxGeometry args={[2.02, 0.07, 1.52]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00C8E0"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      <mesh ref={(node) => { bands.current[1] = node }} position={[0, 0.7, 0]}>
        <boxGeometry args={[2.02, 0.04, 1.52]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00C8E0"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      <mesh ref={clasp} position={[0, 0, 0.76]}>
        <boxGeometry args={[0.25, 0.18, 0.06]} />
        <meshStandardMaterial
          color="#d4a017"
          emissive="#c8920a"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
    </group>
  )
}

export default BoxBody
