import { useLayoutEffect, useRef } from 'react'
import { revealTime, progress, easeOut } from './arsenalReveal'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import BoxBody from './BoxBody'
import BoxLid from './BoxLid'

function GiftBoxScene({ groupRef, rotationRef, velocityRef, isDraggingRef, isOpen, isShaking, onClick, revealRef, reducedMotion }) {
  const { camera, size } = useThree()
  useLayoutEffect(() => {
    // Extend the render area above the box without changing its apparent size.
    camera.setViewOffset(size.width, size.width, 0, size.width - size.height, size.width, size.height)
    camera.updateProjectionMatrix()
    return () => camera.clearViewOffset()
  }, [camera, size.width, size.height])
  const seam = useRef(null)
  const interior = useRef(null)
  const sparks = useRef(null)
  const chargeLight = useRef(null)
  const opening = useRef(new THREE.Vector3())
  useFrame(({ camera, gl }) => {
    if (!groupRef.current) return

    const group = groupRef.current

    if (!isDraggingRef.current && !isOpen && !reducedMotion) {
      velocityRef.current.x *= 0.92
      velocityRef.current.y *= 0.92
      rotationRef.current.x += velocityRef.current.x
      rotationRef.current.y += velocityRef.current.y

      if (Math.abs(velocityRef.current.y) < 0.001) {
        rotationRef.current.y += 0.004
      }
    }

    if (!isOpen && !isShaking && !reducedMotion) {
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
    const time = revealTime(revealRef)
    const exit = easeOut(progress(time, 1.5, 0.85))
    const fade = 1 - exit
    const leak = progress(time, 0.28, 0.42) * fade
    seam.current.material.opacity = reducedMotion ? 0 : leak * 0.8
    seam.current.scale.setScalar(1 - exit * 0.22)
    seam.current.position.y = 0.901 * (1 - exit * 0.22) - exit * 0.22
    interior.current.intensity = reducedMotion ? 0 : leak * 4
    const charge = progress(time, 0.22, 0.65)
    const angle = charge * Math.PI * 2
    chargeLight.current.position.set(Math.cos(angle) * 1.05, 0.5, Math.sin(angle) * 0.8)
    chargeLight.current.intensity = reducedMotion ? 0 : Math.sin(charge * Math.PI) * 8
    sparks.current.children.forEach((spark, i) => {
      const life = progress(time, 0.96 + i * 0.022, 0.48)
      const theta = i * 2.4
      spark.position.set(Math.cos(theta) * life * 0.55, 0.92 + life * 0.9, Math.sin(theta) * life * 0.4)
      spark.material.opacity = reducedMotion || life === 0 ? 0 : (1 - life) * 0.8
      spark.scale.setScalar(1 - life * 0.6)
    })
    // Project the actual opening into the DOM; the pills launch from this point.
    if (time < 1.0) {
      group.updateWorldMatrix(true, false)
      opening.current.set(0, 0.94, 0).applyMatrix4(group.matrixWorld).project(camera)
      const bounds = gl.domElement.getBoundingClientRect()
      revealRef.current.origin = {
        x: bounds.left + (opening.current.x + 1) * bounds.width / 2,
        y: bounds.top + (1 - opening.current.y) * bounds.height / 2,
      }
    }

  })

  return (
    <>
      <ambientLight intensity={1.2} color="#0d2a4a" />
      <directionalLight position={[2, 4, 3]} intensity={1.6} color="#c8e8ff" />
      <pointLight position={[0, 2, 3.5]} intensity={2.2} color="#00E5FF" distance={10} decay={2} />
      <pointLight position={[-2, 1, 2]} intensity={0.8} color="#1a4a7a" distance={7} decay={2} />

      <group ref={groupRef} scale={1.0}>
        <BoxBody onClick={onClick} revealRef={revealRef} reducedMotion={reducedMotion} />
        <mesh ref={seam} position={[0, 0.901, 0]}>
          <boxGeometry args={[2.105, 0.018, 1.605]} />
          <meshBasicMaterial color="#00cfff" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
        <pointLight ref={interior} position={[0, 1.05, 0]} color="#00bfff" intensity={0} distance={4} />
        <pointLight ref={chargeLight} color="#00e5ff" intensity={0} distance={2} />
        <group ref={sparks}>
          {Array.from({ length: 8 }, (_, i) => <mesh key={i}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color="#78f3ff" transparent opacity={0} depthWrite={false} />
          </mesh>)}
        </group>
        <BoxLid revealRef={revealRef} reducedMotion={reducedMotion} />
      </group>
    </>
  )
}

export default GiftBoxScene
