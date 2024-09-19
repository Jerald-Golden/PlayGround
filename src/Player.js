import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RigidBody, useRapier, Physics } from "@react-three/rapier"

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export function Player() {
    const ref = useRef()
    const rapier = useRapier()
    const [, get] = useKeyboardControls()

    const [flyMode, setFlyMode] = useState(false)

    const handleTabPress = (event) => {
        if (event.key === "Tab") {
            setFlyMode((prevFlyMode) => !prevFlyMode)
            event.preventDefault()
        }
    }

    useEffect(() => {
        if (flyMode) {
            console.log("FLY MODE")
        } else {
            console.log("WALK MODE")
        }
    }, [flyMode])

    useEffect(() => {
        window.addEventListener("keydown", handleTabPress)
        return () => {
            window.removeEventListener("keydown", handleTabPress)
        }
    }, [])

    useFrame((state) => {
        const { forward, backward, left, right, jump, shift } = get()
        const velocity = ref.current.linvel()
        state.camera.position.set(...ref.current.translation())
        frontVector.set(0, 0, backward - forward)
        sideVector.set(left - right, 0, 0)

        if (flyMode) {
            direction.set(0, 0, 0)
            if (forward || backward || left || right) {
                direction.add(frontVector).add(new THREE.Vector3(-sideVector.x, sideVector.y, sideVector.z)).normalize().multiplyScalar(SPEED * 5)
                direction.applyEuler(state.camera.rotation)
            }

            ref.current.setLinvel({ x: direction.x, y: direction.y, z: direction.z })
        } else {
            let speed = SPEED
            if (shift) {
                speed = 10
            }
            direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed).applyEuler(state.camera.rotation)
            ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })
            const world = rapier.world.raw()
            const ray = world.castRay(new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }))
            const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
            if (jump && grounded) {
                ref.current.setLinvel({ x: 0, y: 7.5, z: 0 })
            }
        }
    })

    return (
        <>
            <RigidBody ref={ref} colliders={false} mass={flyMode ? 0 : 1} type="dynamic" position={[0, 0, 10]} enabledRotations={[false, false, false]}>
                <CapsuleCollider args={[0.75, 0.5]} />
            </RigidBody>
        </>
    )
}
