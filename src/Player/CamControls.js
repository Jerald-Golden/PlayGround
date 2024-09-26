import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useEffect } from "react";

export function CamControls(ref, offset) {
    const { scene, camera } = useThree();
    const pivot = useMemo(() => new THREE.Object3D(), []);
    const alt = useMemo(() => new THREE.Object3D(), []);
    const yaw = useMemo(() => new THREE.Object3D(), []);
    const pitch = useMemo(() => new THREE.Object3D(), []);
    const worldPosition = useMemo(() => new THREE.Vector3(), []);


    useEffect(() => {
        scene.add(pivot);
        pivot.add(alt);
        alt.position.y = offset[1];
        alt.add(yaw);
        yaw.add(pitch);
        pitch.add(camera);
        camera.position.set(offset[0], 0, offset[2]);

        function onDocumentMouseMove(e) {
            if (document.pointerLockElement) {
                e.preventDefault();
                yaw.rotation.y -= e.movementX * 0.002;
                const v = pitch.rotation.x - e.movementY * 0.002;
                if (v > -1 && v < 0.1) {
                    pitch.rotation.x = v;
                }
            }
        }

        function onDocumentMouseWheel(e) {
            if (document.pointerLockElement) {
                e.preventDefault();
                const v = camera.position.z + e.deltaY * 0.005;
                if (v >= 0.5 && v <= 5) {
                    camera.position.z = v;
                }
            }
        }

        document.addEventListener("mousemove", onDocumentMouseMove);
        document.addEventListener("wheel", onDocumentMouseWheel, { passive: false });
        return () => {
            document.removeEventListener("mousemove", onDocumentMouseMove);
            document.removeEventListener("wheel", onDocumentMouseWheel);
        };
    }, [camera, offset, pitch, pivot, scene, yaw, alt]);

    useFrame((_, delta) => {
        if (ref.current) {
            const pos = ref.current.translation();
            worldPosition.set(pos.x, pos.y, pos.z);
            pivot.position.lerp(worldPosition, delta * 5);
        }
    });
}
