import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { revealTime, progress, easeOut } from './arsenalReveal'
import { Edges } from '@react-three/drei'

function BoxLid({ revealRef, reducedMotion }) {
  const lidRef3D = useRef(null)
  useFrame(() => {
    const lid = lidRef3D.current
    if (!lid) return
    const time = revealTime(revealRef)
    const pressure = easeOut(progress(time, 0.7, 0.14))
    const release = easeOut(progress(time, 0.88, 0.65))
    const exit = easeOut(progress(time, 1.5, 0.85))
    lid.position.y = 1.125 + pressure * 0.08 + release * 0.95 + exit * 0.25
    lid.rotation.x = -release * 0.3
    lid.rotation.y = release * 0.16
    lid.traverse((object) => {
      if (object.material && object.material.opacity !== undefined) {
        if (object.material.userData.initialOpacity === undefined) object.material.userData.initialOpacity = object.material.opacity
        object.material.transparent = true
        object.material.opacity = object.material.userData.initialOpacity * (reducedMotion ? 1 - progress(time, 0, 0.25) : 1 - exit)
      }
    })
  })

  return (
    <group ref={lidRef3D} position={[0, 1.125, 0]}>
      <mesh>
        <boxGeometry args={[2.1, 0.45, 1.6]} />
        <meshStandardMaterial
          color="#102f55"
          roughness={0.25}
          metalness={0.45}
          emissive="#0a2240"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh>
        <boxGeometry args={[2.12, 0.47, 1.62]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges color="#00E5FF" lineWidth={2} />
      </mesh>

      <mesh position={[0, 0.27, 0]}>
        <boxGeometry args={[2.12, 0.08, 0.14]} />
        <meshStandardMaterial color="#cc2222" emissive="#881111" emissiveIntensity={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[0.14, 0.08, 1.62]} />
        <meshStandardMaterial color="#cc2222" emissive="#881111" emissiveIntensity={0.8} roughness={0.4} />
      </mesh>

      <mesh position={[-0.22, 0.38, 0]} rotation={[Math.PI / 2, 0, 0.4]}>
        <torusGeometry args={[0.14, 0.05, 8, 16]} />
        <meshStandardMaterial color="#dd2222" emissive="#991111" emissiveIntensity={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.22, 0.38, 0]} rotation={[Math.PI / 2, 0, -0.4]}>
        <torusGeometry args={[0.14, 0.05, 8, 16]} />
        <meshStandardMaterial color="#dd2222" emissive="#991111" emissiveIntensity={0.9} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#ee3333" emissive="#bb1111" emissiveIntensity={1.0} roughness={0.2} />
      </mesh>
    </group>
  )
}

export default BoxLid
