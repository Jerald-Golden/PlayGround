import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky, PointerLockControls, KeyboardControls } from "@react-three/drei";
import { Ground } from "./Ground";
import { Player } from "./Player";
import { ThrowBall } from "./BallGame/ThrowBall";
import House from "./House";
import Grass from "./Grass";

export default function App() {
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === null) {
        setCooldown(true);
        setControlsEnabled(false);
        setTimeout(() => {
          setCooldown(false);
          setControlsEnabled(true);
        }, 1500);
      }
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

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
        <Physics gravity={[0, -30, 0]}>
          <Ground />
          <Grass />
          <House />
          <Player />
          <ThrowBall />
        </Physics>
        {controlsEnabled && !cooldown && <PointerLockControls />}
      </Canvas>
    </KeyboardControls>
  );
}
