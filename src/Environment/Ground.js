import { useRef, useEffect } from "react";
import { useStore } from "../store";
import { usePlane } from "@react-three/cannon";

export default function Ground() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], material: 'ground' }), useRef())
  const groundObjects = useStore((state) => state.groundObjects)

  useEffect(() => {
    const id = ref.current.id
    groundObjects[id] = ref.current
    return () => {
      delete groundObjects[id]
    }
  }, [groundObjects, ref])

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={"pink"} />
    </mesh>
  )
}