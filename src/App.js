import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky, KeyboardControls } from "@react-three/drei";
import { useGame } from "ecctrl";
import Light from "./Environment/Lights";
import Player from "./Player/Player";
import Map from "./Environment/Map";
import Preloader from "./Environment/loadingScreen/preLoader";

export default function App() {
  const idleAnimation = useGame((state) => state.idle);

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    { name: "action1", keys: ["c", "C"] },
    { name: "action2", keys: ["c", "C"] },
  ];

  const [cooldown, setCooldown] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [debug, setDebug] = useState(false);
  const [mapType, setMapType] = useState("MiniGames");
  const [isLoaded, setIsLoaded] = useState(false);

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
        idleAnimation();
        setIsLocked(true);
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [setIsLocked, isLocked, idleAnimation]);

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
      {!isLoaded ? (
        <>
          <Preloader onLoaded={() => setIsLoaded(true)} />
        </>
      ) : (
        <>
          <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1 }}>
            <label>
              Select Map:
              <select value={mapType} onChange={handleMapChange}>
                <option value="MiniGames">MiniGames</option>
                <option value="Clock_Tower">Clock Tower</option>
                <option value="Cs_Go">Cs Go</option>
                <option value="Level1">Level1</option>
                <option value="Level2">Level2</option>
              </select>
            </label>
          </div>

          <Canvas shadows camera={{ fov: 45 }} onPointerDown={handlePointerDown}>
            <Sky sunPosition={[100, 20, 100]} />
            <Physics gravity={[0, -9.81, 0]} debug={debug}>
              <Light />
              <KeyboardControls map={keyboardMap}>
                <Map mapType={mapType} />
                <Player key={mapType} position={[10, 1.5, 0]} />
              </KeyboardControls>
            </Physics>
          </Canvas>
        </>
      )}
    </>
  );
}
