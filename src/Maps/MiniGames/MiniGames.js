import { RigidBody } from "@react-three/rapier";

import House from "./House";
import Grass from "./Grass";

export default function MiniGames() {

  return (
    <>
      <RigidBody type="fixed" colliders={"hull"} >
        <mesh name="Ground" rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={"pink"} />
        </mesh>
      </RigidBody>
      <House />
      <Grass />
    </>
  );
}