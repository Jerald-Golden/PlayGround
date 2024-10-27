import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky, KeyboardControls } from "@react-three/drei";
import { useGame } from "ecctrl";
import Light from "./Environment/Lights";
import Player from "./Player/Player";
import Map from "./Environment/Map";

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
  const [debug, setDebug] = useState(false);
  const [mapType, setMapType] = useState("MiniGames");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "`") {
        setDebug((prevDebug) => !prevDebug);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === null) {
        setIsLocked(false);
        setCooldown(true);
        setTimeout(() => {
          setCooldown(false);
        }, 1500);
      } else {
        jumpAnimation();
        setIsLocked(true);
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [setIsLocked, jumpAnimation, isLocked]);

  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && !cooldown) {
      e.target.requestPointerLock();
    }
  };

  const handleMapChange = (e) => {
    setMapType(e.target.value);
  };

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
        <label>
          Select Map:
          <select value={mapType} onChange={handleMapChange}>
            <option value="MiniGames">MiniGames</option>
            <option value="Level1">Level1</option>
            <option value="Level2">Level2</option>
          </select>
        </label>
      </div>

      <Canvas shadows camera={{ fov: 45 }} onPointerDown={handlePointerDown}>
        <Sky sunPosition={[100, 20, 100]} />
        <Suspense>
          <Physics gravity={[0, -9.81, 0]} debug={debug}>
            <Light />
            <KeyboardControls map={keyboardMap}>
              <Map mapType={mapType} />
              <Player key={mapType} position={[10, 1.5, 0]} />
            </KeyboardControls>
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}
