import { useRef, useEffect } from "react";
import { useStore } from "../store";
import { usePlane } from "@react-three/cannon";

export default function Ground() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], material: 'ground', args: [100, 100] }), useRef())
  const groundObjects = useStore((state) => state.groundObjects)

  useEffect(() => {
    const id = ref.current.id
    groundObjects[id] = ref.current
    return () => {
      delete groundObjects[id]
    }
  }, [groundObjects, ref])

  return (
    <>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"pink"} />
      </mesh>
      {/* <Obstacles /> */}
    </>
  )
}

// const OBSTACLES = [...Array(25)].map((_, i) => ({
//   position: [(Math.random() - 0.5) * 25, 2 * i, (Math.random() - 0.5) * 25],
//   args: [Math.random() * 10, Math.random() * 2, Math.random() * 5]
// }))

// function Obstacle({ args, position, ...props }) {
//   const [ref] = useBox(() => ({ args, mass: 1, position: [0, 0, 0], ...props }), useRef())

//   const groundObjects = useStore((state) => state.groundObjects)

//   useEffect(() => {
//     const id = ref.current.id
//     groundObjects[id] = ref.current
//     return () => {
//       delete groundObjects[id]
//     }
//   }, [groundObjects, ref])

//   return (
//     <mesh ref={ref} castShadow receiveShadow>
//       <boxGeometry args={[...args]} />
//       <meshStandardMaterial />
//     </mesh>
//   )
// }

// function Obstacles() {
//   return (
//     <>
//       {OBSTACLES.map(({ position, args }, i) => (
//         <Obstacle key={i} position={position} args={args} material={'ground'}></Obstacle>
//       ))}
//     </>
//   )
// }