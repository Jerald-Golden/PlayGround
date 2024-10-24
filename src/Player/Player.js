import Ecctrl from 'ecctrl'
import Character from './Character';

export default function CharacterModel() {

  return (
    <Ecctrl
      slopeMaxAngle={45}
      slopeRayOriginOffest={0.3}
      slopeRayLength={1}
      slopeUpExtraForce={0.2}
      slopeDownExtraForce={0.4}
      position={[10, 1.5, 0]}
      airDragMultiplier={1.5}
      floatHeight={0}
      capsuleHalfHeight={0.35}
      capsuleRadius={0.2}
      animated={true}
      autoBalance={false}
    >
      <Character />
    </Ecctrl>
  )
}