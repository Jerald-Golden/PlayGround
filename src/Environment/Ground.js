import { RigidBody } from "@react-three/rapier";

export default function Ground() {

  return (
    <RigidBody type="fixed" colliders={"hull"} >
      <mesh name="Ground" rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"pink"} />
      </mesh>
    </RigidBody>
  );
}