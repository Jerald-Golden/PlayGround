import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from '@react-three/cannon'
import { Sky } from "@react-three/drei";
import Ground from "./Environment/Ground";
import Light from "./Environment/Lights";
import Player from "./Player/Player";
import House from "./House";
import Grass from "./Grass";

export default function App() {

  const [cooldown, setCooldown] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const capture = () => {
      if (!cooldown && !isLocked) {
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
        document.body.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === null) {
        setIsLocked(false);
        setCooldown(true);
        setTimeout(() => {
          setCooldown(false);
        }, 1500);
      } else {
        setIsLocked(true);
      }
    };

    document.addEventListener("click", capture);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      document.removeEventListener("click", capture);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [cooldown, isLocked]);
  return (
    <Canvas shadows camera={{ fov: 45 }}>
      <Sky sunPosition={[100, 20, 100]} />
      <Suspense>
        <Physics>
          <Ground />
          <Light />
          {/* <Debug> */}
          <Player position={[0, 3, 10]} />
          <House />
          {/* </Debug> */}
          {/*<Grass /> */}
        </Physics>
      </Suspense>
    </Canvas>
  );
}
