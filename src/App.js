import { Suspense, useEffect } from "react";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky, KeyboardControls } from "@react-three/drei";
import Ground from "./Environment/Ground";
import Light from "./Environment/Lights";
import Player from "./Player/Player";
import House from "./House";
import Grass from "./Grass";

import { useGame } from "ecctrl";

export default function App() {

  const jumpAnimation = useGame((state) => state.jump);

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] }
  ];

  const [cooldown, setCooldown] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === null) {
        setIsLocked(false);
        setCooldown(true);
        setTimeout(() => {
          setCooldown(false);
        }, 1500);
      } else {
        jumpAnimation()
        setIsLocked(true);
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, []);

  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && !cooldown) {
      e.target.requestPointerLock();
    }
  };

  return (
    <Canvas
      shadows
      camera={{ fov: 45 }}
      onPointerDown={handlePointerDown}
    >
      <Sky sunPosition={[100, 20, 100]} />
      <Suspense>
        <Physics debug={true}>
          <Ground />
          <Light />
          <KeyboardControls map={keyboardMap}>
            <Player />
          </KeyboardControls>
          <House />
          <Grass />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
