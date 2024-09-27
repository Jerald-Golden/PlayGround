import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber"
import { useMemo, useEffect } from "react"

export default function useFollowCam(ref, offset) {
    const { scene, camera } = useThree()
    const pivot = useMemo(() => new THREE.Object3D(), [])
    const alt = useMemo(() => new THREE.Object3D(), [])
    const yaw = useMemo(() => new THREE.Object3D(), [])
    const pitch = useMemo(() => new THREE.Object3D(), [])
    const worldPosition = useMemo(() => new THREE.Vector3(), [])

    useEffect(() => {
        function onDocumentMouseMove(e) {
            if (document.pointerLockElement) {
                e.preventDefault()
                yaw.rotation.y -= e.movementX * 0.002
                const v = pitch.rotation.x - e.movementY * 0.002
                if (v > -1 && v < 0.1) {
                    pitch.rotation.x = v
                }
            }
        }

        function onDocumentMouseWheel(e) {
            if (document.pointerLockElement) {
                e.preventDefault()
                const v = camera.position.z + e.deltaY * 0.005
                if (v >= 0.5 && v <= 20) {
                    camera.position.z = v
                }
            }
        }

        scene.add(pivot)
        pivot.add(alt)
        alt.position.y = offset[1]
        alt.add(yaw)
        yaw.add(pitch)
        pitch.add(camera)
        camera.position.set(offset[0], 0, offset[2])

        document.addEventListener('mousemove', onDocumentMouseMove)
        document.addEventListener('wheel', onDocumentMouseWheel, { passive: false })
        return () => {
            document.removeEventListener('mousemove', onDocumentMouseMove)
            document.removeEventListener('wheel', onDocumentMouseWheel)
        }
    }, [camera, pitch, pivot, scene, alt, yaw, offset])

    useFrame((_, delta) => {
        ref.current.getWorldPosition(worldPosition)
        pivot.position.lerp(worldPosition, delta * 5)
    })

    return { pivot, alt, yaw, pitch }
}