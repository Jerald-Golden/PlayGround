import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { AccumulativeShadows, RandomizedLight } from '@react-three/drei'


export function Ground(props) {
  return (
    <>
      <RigidBody {...props} type="fixed" colliders={false}>
        <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="pink" />
        </mesh>
        <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
      </RigidBody>
      <directionalLight position={[5, 5, 5]} intensity={0.5} shadow-mapSize={1024} castShadow />
      <ambientLight intensity={0.3} />
      <pointLight intensity={0.8} position={[100, 100, 100]} />
      <AccumulativeShadows frames={100} alphaTest={0.85} opacity={0.75} scale={100} position={[0, -1.5, 0]}>
        <RandomizedLight amount={8} radius={2.5} ambient={0.5} intensity={1} position={[5, 5, 5]} bias={0.001} />
      </AccumulativeShadows>
    </>
  )
}