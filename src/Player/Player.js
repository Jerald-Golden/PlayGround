import Ecctrl from 'ecctrl';
import Character from './Character';

export default function Player({ position }) {
  console.log('position: ', position);

  return (
    <Ecctrl
      characterInitDir={5}
      camInitDir={{ x: 0, y: -1.5 }}
      slopeMaxAngle={45}
      slopeRayOriginOffest={0.3}
      slopeRayLength={1}
      slopeUpExtraForce={0.2}
      slopeDownExtraForce={0.4}
      position={position}
      airDragMultiplier={1.5}
      floatHeight={0}
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