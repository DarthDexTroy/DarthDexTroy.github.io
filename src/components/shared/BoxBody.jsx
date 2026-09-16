import { Edges } from '@react-three/drei'

function BoxBody({ onClick }) {
  return (
    <group>
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

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.02, 0.07, 1.52]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00C8E0"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[2.02, 0.04, 1.52]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00C8E0"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 0, 0.76]}>
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
