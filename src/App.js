import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky, KeyboardControls } from "@react-three/drei";
import { Ground } from "./Ground";
import { Player } from "./Player/Player";
import { ThrowBall } from "./BallGame/ThrowBall";
import House from "./House";
import Grass from "./Grass";

export default function App() {

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "shift", keys: ["ShiftLeft", "ShiftRight"] },
      ]}
    >
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Physics gravity={[0, -9.81, 0]}>
          <Ground />
          <Grass />
          <House />
          <Player />
          <ThrowBall />
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}
