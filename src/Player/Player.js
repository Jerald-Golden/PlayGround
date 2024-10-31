import Ecctrl from 'ecctrl';
import Character from './Character';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';


export default function Player({ position }) {

  const [view, setView] = useState(true);

  const ref = useRef();
  const camPosition = useRef();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "p" || event.key === "P") {
        setView((prevView) => !prevView);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useFrame(() => {
    const newCamPos = ref.current?.worldCom();
    if (newCamPos && camPosition.current !== newCamPos) {
      camPosition.current = newCamPos;
    }
  });


  return (
    <Ecctrl
      ref={ref}
      key={view}
      camCollision={view ? true : false}
      camMinDis={view ? -0.7 : -0.01}
      camInitDis={view ? -5 : -0.01}
      camFollowMult={view ? 11 : 1000}
      camLerpMult={view ? 25 : 1000}
      turnVelMultiplier={view ? 0.2 : 1}
      turnSpeed={view ? 15 : 100}
      mode={view ? null : "CameraBasedMovement"}
      position={camPosition.current ? [camPosition.current.x, camPosition.current.y, camPosition.current.z] : position}
      characterInitDir={4.9}
      camInitDir={{ x: 0, y: -1.5 }}
      slopeMaxAngle={45}
      slopeRayOriginOffest={0.3}
      slopeRayLength={3.2}
      slopeUpExtraForce={0.2}
      slopeDownExtraForce={0.4}
      airDragMultiplier={1.5}
      floatHeight={0.1}
      jumpVel={3}
      capsuleHalfHeight={0.35}
      capsuleRadius={0.2}
      animated={true}
      autoBalance={false}
    >
      <Character />
    </Ecctrl>
  )
}