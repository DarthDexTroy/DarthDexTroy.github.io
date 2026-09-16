import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

function BoxLid({ isOpen }) {
  const lidRef3D = useRef(null)

  useFrame(() => {
    if (!lidRef3D.current) return

    const lid = lidRef3D.current

    if (isOpen) {
      lid.position.y = THREE.MathUtils.lerp(lid.position.y, 3.8, 0.07)
      lid.rotation.x = THREE.MathUtils.lerp(lid.rotation.x, -0.35, 0.07)
      lid.rotation.y = THREE.MathUtils.lerp(lid.rotation.y, 0.2, 0.07)
      return
    }

    lid.position.y = THREE.MathUtils.lerp(lid.position.y, 1.125, 0.08)
    lid.rotation.x = THREE.MathUtils.lerp(lid.rotation.x, 0, 0.1)
    lid.rotation.y = THREE.MathUtils.lerp(lid.rotation.y, 0, 0.1)
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
